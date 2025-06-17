const { updateData, getAllData } = require("../../controllers/functions");

async function updateDataCoupon(req, res) {
  try {
    const {
      coupon_id,
      coupon_name,
      coupon_count,
      coupon_start,
      coupon_end,
      coupon_discount,
    } = req.body;

    // تحقق من وجود coupon_id
    if (!coupon_id) {
      return res.status(400).json({
        status: "failure",
        message: "coupon_id is required.",
      });
    }

    // التحقق من وجود الكوبون في قاعدة البيانات
    const checkCouponResult = await getAllData("coupon", "coupon_id = ?", [
      coupon_id,
    ]);

    if (
      checkCouponResult.status !== "success" ||
      !checkCouponResult.data ||
      checkCouponResult.data.length === 0
    ) {
      return res.status(404).json({
        status: "failure",
        message: "Coupon not found.",
      });
    }

    // إعداد البيانات للتحديث
    const updateCouponData = {
      coupon_name,
      coupon_count,
      coupon_start,
      coupon_end,
      coupon_discount,
    };

    // تحديث البيانات
    const result = await updateData(
      "coupon",
      updateCouponData,
      `coupon_id = ?`,
      [coupon_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Coupon data updated successfully.",
        data: updateCouponData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update coupon data.",
      });
    }
  } catch (error) {
    console.error("Error in updating coupon data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating coupon data",
      error: error.message,
    });
  }
}

module.exports = { updateDataCoupon };
