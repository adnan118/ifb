const { getConnection } = require("../../../controllers/db");

async function changeUserPlan(req, res) {
  let connection;

  try {
    const { personalData_users_id, personalData_offers_id } = req.body || {};
    const userId = Number(personalData_users_id);
    const offerId = Number(personalData_offers_id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        status: "failure",
        message: "personalData_users_id is required.",
      });
    }

    if (!Number.isInteger(offerId) || offerId <= 0) {
      return res.status(400).json({
        status: "failure",
        message: "personalData_offers_id is required.",
      });
    }

    const authUserId = Number(req.authUser?.id);
    const isAdmin = req.authUser?.role === "admin";
    if (!Number.isInteger(authUserId)) {
      return res.status(401).json({
        status: "failure",
        message: "Authentication is required.",
      });
    }

    if (!isAdmin && authUserId !== userId) {
      return res.status(403).json({
        status: "failure",
        message: "You cannot change another user's plan.",
      });
    }

    connection = await getConnection();
    await connection.beginTransaction();

    const [offers] = await connection.execute(
      "SELECT offers_id, offers_titleAr, offers_titleEn, offers_price FROM offers WHERE offers_id = ? LIMIT 1",
      [offerId]
    );
    if (offers.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        status: "failure",
        message: "The requested plan was not found.",
      });
    }

    const [personalData] = await connection.execute(
      "SELECT personalData_id FROM personaldataregister WHERE personalData_users_id = ? LIMIT 1",
      [userId]
    );
    if (personalData.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        status: "failure",
        message: "Personal data was not found for this user.",
      });
    }

    const requiresPayment = Number(offers[0].offers_price) > 0;
    const pendingExpirationDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    await connection.execute(
      `UPDATE personaldataregister
       SET personalData_offers_id = ?,
           personalData_isPaidOffer = ?,
           personalData_expOffer = ?
       WHERE personalData_users_id = ?`,
      [
        offerId,
        0,
        requiresPayment ? pendingExpirationDate : null,
        userId,
      ]
    );
    await connection.commit();

    return res.status(200).json({
      status: "success",
      message: "Plan changed successfully.",
      data: {
        personalData_users_id: userId,
        personalData_offers_id: offerId,
        offers_titleAr: offers[0].offers_titleAr,
        offers_titleEn: offers[0].offers_titleEn,
        requiresPayment,
      },
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (_) {}
    }
    console.error("Error changing user plan:", error);
    return res.status(500).json({
      status: "failure",
      message: "There is a problem changing the plan.",
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (_) {}
    }
  }
}

module.exports = { changeUserPlan };
