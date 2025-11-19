const { updateData } = require("../../controllers/functions");

async function updateDataCouponUsage(req, res) {
  try {
    const {
      id,
      coupon_name,
      user_id,
      used_at
    } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "failure",
        message: "Coupon usage ID is required",
      });
    }

    // إعداد البيانات للتحديث - فقط الحقول المرسلة
    const updateCouponUsageData = {};
    
    if (coupon_name) updateCouponUsageData.coupon_name = coupon_name.trim();
    if (user_id) updateCouponUsageData.user_id = user_id;
    if (used_at) updateCouponUsageData.used_at = used_at;

    // التأكد من وجود بيانات للتحديث
    if (Object.keys(updateCouponUsageData).length === 0) {
      return res.status(400).json({
        status: "failure",
        message: "No data provided for update",
      });
    }

    const result = await updateData(
      "coupon_usage",
      updateCouponUsageData,
      `id = ?`,
      [id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Coupon usage data updated successfully.",
        data: updateCouponUsageData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update coupon usage data.",
      });
    }
  } catch (error) {
    console.error("Error in updating coupon usage data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating coupon usage data",
      error: error.message,
    });
  }
}

module.exports = { updateDataCouponUsage };
