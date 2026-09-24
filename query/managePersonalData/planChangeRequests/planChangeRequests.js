const { getConnection } = require("../../../controllers/db");

const PENDING = "pending";
const MAX_REASON_LENGTH = 1000;

function getAuthenticatedUserId(req) {
  const userId = Number(req.authUser?.id);
  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

function toMoney(value) {
  return Number(Number(value || 0).toFixed(2));
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

async function findCouponForPreview(connection, couponName, userId, lock = false) {
  if (!couponName) return null;

  const normalizedName = String(couponName).trim();
  if (!normalizedName || normalizedName.length > 255) {
    const error = new Error("Invalid coupon code.");
    error.statusCode = 400;
    throw error;
  }

  const lockClause = lock ? " FOR UPDATE" : "";
  const [coupons] = await connection.execute(
    `SELECT coupon_id, coupon_name, coupon_count, coupon_start, coupon_end, coupon_discount
     FROM coupon
     WHERE coupon_name = ?
       AND coupon_count > 0
       AND coupon_start <= ?
       AND coupon_end >= ?
     LIMIT 1${lockClause}`,
    [normalizedName, todayDate(), todayDate()]
  );

  if (coupons.length === 0) {
    const error = new Error("Coupon is invalid, expired, or unavailable.");
    error.statusCode = 400;
    throw error;
  }

  const coupon = coupons[0];
  const [existingRedemptions] = await connection.execute(
    `SELECT id
     FROM coupon_usage
     WHERE coupon_id = ? AND user_id = ?
     LIMIT 1${lockClause}`,
    [coupon.coupon_id, userId]
  );

  if (existingRedemptions.length > 0) {
    const error = new Error("This coupon has already been used by this user.");
    error.statusCode = 409;
    throw error;
  }

  return coupon;
}

function buildPriceSnapshot(offer, coupon) {
  const originalPrice = toMoney(offer.offers_price);
  const couponDiscountPercent = coupon
    ? Math.max(0, Math.min(100, Number(coupon.coupon_discount) || 0))
    : 0;
  const discountAmount = toMoney((originalPrice * couponDiscountPercent) / 100);

  return {
    originalPrice,
    couponDiscountPercent,
    discountAmount,
    finalPrice: toMoney(Math.max(0, originalPrice - discountAmount)),
  };
}

async function createPlanChangeRequest(req, res) {
  let connection;
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ status: "failure", message: "Authentication is required." });
    }

    const requestedOfferId = Number(req.body?.requested_offer_id);
    const reason = String(req.body?.reason || "").trim();
    const couponName = req.body?.coupon_name;

    if (!Number.isInteger(requestedOfferId) || requestedOfferId <= 0) {
      return res.status(400).json({ status: "failure", message: "requested_offer_id is required." });
    }
    if (!reason || reason.length > MAX_REASON_LENGTH) {
      return res.status(400).json({ status: "failure", message: "reason is required and must not exceed 1000 characters." });
    }

    connection = await getConnection();
    await connection.beginTransaction();

    const [personalDataRows] = await connection.execute(
      `SELECT personalData_offers_id
       FROM personaldataregister
       WHERE personalData_users_id = ?
       LIMIT 1 FOR UPDATE`,
      [userId]
    );
    if (personalDataRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ status: "failure", message: "Personal data was not found for this user." });
    }

    const currentOfferId = Number(personalDataRows[0].personalData_offers_id) || null;
    if (currentOfferId === requestedOfferId) {
      await connection.rollback();
      return res.status(400).json({ status: "failure", message: "The requested offer is already the current offer." });
    }

    const [pendingRequests] = await connection.execute(
      `SELECT request_id
       FROM plan_change_requests
       WHERE user_id = ? AND status = ?
       LIMIT 1 FOR UPDATE`,
      [userId, PENDING]
    );
    if (pendingRequests.length > 0) {
      await connection.rollback();
      return res.status(409).json({ status: "failure", message: "A plan change request is already under review." });
    }

    const [offers] = await connection.execute(
      `SELECT offers_id, offers_titleAr, offers_titleEn, offers_price
       FROM offers
       WHERE offers_id = ?
       LIMIT 1`,
      [requestedOfferId]
    );
    if (offers.length === 0) {
      await connection.rollback();
      return res.status(404).json({ status: "failure", message: "The requested offer was not found." });
    }

    const coupon = await findCouponForPreview(connection, couponName, userId);
    const price = buildPriceSnapshot(offers[0], coupon);
    const [result] = await connection.execute(
      `INSERT INTO plan_change_requests (
        user_id, current_offer_id, requested_offer_id, reason, status,
        original_price, coupon_id, coupon_code, coupon_discount_percent,
        discount_amount, final_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        currentOfferId,
        requestedOfferId,
        reason,
        PENDING,
        price.originalPrice,
        coupon?.coupon_id || null,
        coupon?.coupon_name || null,
        price.couponDiscountPercent,
        price.discountAmount,
        price.finalPrice,
      ]
    );

    await connection.commit();
    return res.status(201).json({
      status: "success",
      message: "Plan change request submitted successfully.",
      data: {
        request_id: result.insertId,
        requested_offer_id: requestedOfferId,
        status: PENDING,
        created_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (connection) {
      try { await connection.rollback(); } catch (_) {}
    }
    console.error("Error creating plan change request:", error);
    return res.status(error.statusCode || 500).json({
      status: "failure",
      message: error.statusCode ? error.message : "There is a problem creating the plan change request.",
    });
  } finally {
    if (connection) {
      try { await connection.end(); } catch (_) {}
    }
  }
}

async function getMyPlanChangeRequests(req, res) {
  let connection;
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ status: "failure", message: "Authentication is required." });
    }

    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT r.request_id, r.current_offer_id, r.requested_offer_id, r.reason,
              r.status, r.rejection_reason, r.created_at, r.reviewed_at,
              requested.offers_titleAr AS requested_offer_titleAr,
              requested.offers_titleEn AS requested_offer_titleEn
       FROM plan_change_requests r
       INNER JOIN offers requested ON requested.offers_id = r.requested_offer_id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );
    return res.json({ status: "success", data: rows });
  } catch (error) {
    console.error("Error reading user plan change requests:", error);
    return res.status(500).json({ status: "failure", message: "There is a problem fetching plan change requests." });
  } finally {
    if (connection) {
      try { await connection.end(); } catch (_) {}
    }
  }
}

async function cancelPlanChangeRequest(req, res) {
  let connection;
  try {
    const userId = getAuthenticatedUserId(req);
    const requestId = Number(req.body?.request_id);
    if (!userId) return res.status(401).json({ status: "failure", message: "Authentication is required." });
    if (!Number.isInteger(requestId) || requestId <= 0) {
      return res.status(400).json({ status: "failure", message: "request_id is required." });
    }

    connection = await getConnection();
    const [result] = await connection.execute(
      `UPDATE plan_change_requests
       SET status = 'cancelled'
       WHERE request_id = ? AND user_id = ? AND status = ?`,
      [requestId, userId, PENDING]
    );
    if (result.affectedRows === 0) {
      return res.status(409).json({ status: "failure", message: "Only a pending request owned by the user can be cancelled." });
    }
    return res.json({ status: "success", message: "Plan change request cancelled successfully." });
  } catch (error) {
    console.error("Error cancelling plan change request:", error);
    return res.status(500).json({ status: "failure", message: "There is a problem cancelling the plan change request." });
  } finally {
    if (connection) {
      try { await connection.end(); } catch (_) {}
    }
  }
}

async function getPlanChangeRequestsForAdmin(req, res) {
  let connection;
  try {
    const status = req.body?.status;
    const allowedStatuses = ["pending", "approved", "rejected", "cancelled"];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ status: "failure", message: "Invalid status filter." });
    }

    connection = await getConnection();
    const params = [];
    let statusClause = "";
    if (status) {
      statusClause = "WHERE r.status = ?";
      params.push(status);
    }

    const [rows] = await connection.execute(
      `SELECT r.*, currentOffer.offers_titleAr AS current_offer_titleAr,
              currentOffer.offers_titleEn AS current_offer_titleEn,
              requestedOffer.offers_titleAr AS requested_offer_titleAr,
              requestedOffer.offers_titleEn AS requested_offer_titleEn
       FROM plan_change_requests r
       LEFT JOIN offers currentOffer ON currentOffer.offers_id = r.current_offer_id
       INNER JOIN offers requestedOffer ON requestedOffer.offers_id = r.requested_offer_id
       ${statusClause}
       ORDER BY CASE WHEN r.status = 'pending' THEN 0 ELSE 1 END, r.created_at DESC`,
      params
    );
    return res.json({ status: "success", data: rows });
  } catch (error) {
    console.error("Error reading admin plan change requests:", error);
    return res.status(500).json({ status: "failure", message: "There is a problem fetching plan change requests." });
  } finally {
    if (connection) {
      try { await connection.end(); } catch (_) {}
    }
  }
}

async function approvePlanChangeRequest(req, res) {
  let connection;
  try {
    const adminId = getAuthenticatedUserId(req);
    const requestId = Number(req.body?.request_id);
    if (!adminId) return res.status(401).json({ status: "failure", message: "Authentication is required." });
    if (!Number.isInteger(requestId) || requestId <= 0) {
      return res.status(400).json({ status: "failure", message: "request_id is required." });
    }

    connection = await getConnection();
    await connection.beginTransaction();
    const [requests] = await connection.execute(
      "SELECT * FROM plan_change_requests WHERE request_id = ? LIMIT 1 FOR UPDATE",
      [requestId]
    );
    if (requests.length === 0) {
      await connection.rollback();
      return res.status(404).json({ status: "failure", message: "Plan change request was not found." });
    }
    const request = requests[0];
    if (request.status !== PENDING) {
      await connection.rollback();
      return res.status(409).json({ status: "failure", message: "Only a pending request can be approved." });
    }

    if (request.coupon_id) {
      const coupon = await findCouponForPreview(connection, request.coupon_code, request.user_id, true);
      if (Number(coupon.coupon_id) !== Number(request.coupon_id)) {
        const error = new Error("The coupon attached to this request is no longer valid.");
        error.statusCode = 409;
        throw error;
      }
      await connection.execute(
        `INSERT INTO coupon_usage (
          coupon_name, user_id, used_at, coupon_id, request_id,
          original_price, discount_amount, final_price, status
        ) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, 'redeemed')`,
        [
          coupon.coupon_name,
          request.user_id,
          coupon.coupon_id,
          request.request_id,
          request.original_price,
          request.discount_amount,
          request.final_price,
        ]
      );
      await connection.execute(
        "UPDATE coupon SET coupon_count = coupon_count - 1 WHERE coupon_id = ? AND coupon_count > 0",
        [coupon.coupon_id]
      );
    }

    // Keep the existing payment state and expiry date intact. Only the assigned program/offer changes.
    const [personalDataResult] = await connection.execute(
      "UPDATE personaldataregister SET personalData_offers_id = ? WHERE personalData_users_id = ?",
      [request.requested_offer_id, request.user_id]
    );
    if (personalDataResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ status: "failure", message: "Personal data was not found for this user." });
    }

    await connection.execute(
      `UPDATE plan_change_requests
       SET status = 'approved', reviewed_by = ?, reviewed_at = NOW(), rejection_reason = NULL
       WHERE request_id = ?`,
      [adminId, requestId]
    );
    await connection.commit();
    return res.json({
      status: "success",
      message: "Plan change request approved successfully.",
      data: { request_id: requestId, status: "approved", requested_offer_id: request.requested_offer_id },
    });
  } catch (error) {
    if (connection) {
      try { await connection.rollback(); } catch (_) {}
    }
    console.error("Error approving plan change request:", error);
    return res.status(error.statusCode || 500).json({
      status: "failure",
      message: error.statusCode ? error.message : "There is a problem approving the plan change request.",
    });
  } finally {
    if (connection) {
      try { await connection.end(); } catch (_) {}
    }
  }
}

async function rejectPlanChangeRequest(req, res) {
  let connection;
  try {
    const adminId = getAuthenticatedUserId(req);
    const requestId = Number(req.body?.request_id);
    const rejectionReason = String(req.body?.rejection_reason || "").trim();
    if (!adminId) return res.status(401).json({ status: "failure", message: "Authentication is required." });
    if (!Number.isInteger(requestId) || requestId <= 0) {
      return res.status(400).json({ status: "failure", message: "request_id is required." });
    }
    if (!rejectionReason || rejectionReason.length > MAX_REASON_LENGTH) {
      return res.status(400).json({ status: "failure", message: "rejection_reason is required and must not exceed 1000 characters." });
    }

    connection = await getConnection();
    const [result] = await connection.execute(
      `UPDATE plan_change_requests
       SET status = 'rejected', reviewed_by = ?, reviewed_at = NOW(), rejection_reason = ?
       WHERE request_id = ? AND status = ?`,
      [adminId, rejectionReason, requestId, PENDING]
    );
    if (result.affectedRows === 0) {
      return res.status(409).json({ status: "failure", message: "Only a pending request can be rejected." });
    }
    return res.json({ status: "success", message: "Plan change request rejected successfully." });
  } catch (error) {
    console.error("Error rejecting plan change request:", error);
    return res.status(500).json({ status: "failure", message: "There is a problem rejecting the plan change request." });
  } finally {
    if (connection) {
      try { await connection.end(); } catch (_) {}
    }
  }
}

async function getSelectableOffers(req, res) {
  let connection;
  try {
    connection = await getConnection();
    const [offers] = await connection.execute(
      "SELECT offers_id, offers_titleAr, offers_titleEn FROM offers ORDER BY offers_id ASC"
    );
    return res.json({ status: "success", data: offers });
  } catch (error) {
    console.error("Error getting selectable offers:", error);
    return res.status(500).json({ status: "failure", message: "There is a problem fetching offers." });
  } finally {
    if (connection) {
      try { await connection.end(); } catch (_) {}
    }
  }
}

module.exports = {
  approvePlanChangeRequest,
  cancelPlanChangeRequest,
  createPlanChangeRequest,
  getMyPlanChangeRequests,
  getPlanChangeRequestsForAdmin,
  getSelectableOffers,
  rejectPlanChangeRequest,
};
