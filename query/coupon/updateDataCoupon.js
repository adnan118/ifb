const { updateData } = require("../../controllers/functions");

async function updateDataCoupon(req, res) {
  try {
    const {
      coupon_name,
      coupon_id,
      coupon_count,
      coupon_start,
      coupon_end,
      coupon_discount,
    } = req.body;

    // إعداد البيانات للتحديث
    const updateCouponData = {
      coupon_name: coupon_name,
      coupon_count: coupon_count,
      coupon_start: coupon_start,
      coupon_end: coupon_end,
      coupon_discount: coupon_discount,
    };

    const result = await updateData(
      "coupon",
      updateCouponData,
      `coupon_id = ${coupon_id}`
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
