const { updateData, getAllData } = require("../../controllers/functions");

async function useDataCoupon(req, res) {
  try {
    const { coupon_name } = req.body;

    if (!coupon_name) {
      return res.status(400).json({
        status: "failure",
        message: "Coupon coupon_name is required",
      });
    }

    // صياغة التاريخ بصيغة yyyy-mm-dd
    const nowDate = new Date().toISOString().split("T")[0];
    if (coupon_name) {
      coupon_name = coupon_name.trim(); // إزالة الفراغات
    }
    // التحقق من صلاحية الكوبون
    const whereClause = `
      coupon_count > 0
      AND coupon_end >= ?
      AND coupon_name = ?
    `;

    const validCouponResult = await getAllData("coupon", whereClause, [
      nowDate,
      coupon_name,
    ]);

    if (validCouponResult.status !== "success" || !validCouponResult.data || validCouponResult.data.length === 0) {
      return res.status(400).json({
        status: "failure",
        message: "Invalid or expired coupon",
      });
    }

    const coupon = validCouponResult.data[0];

    // تحديث عدد مرات استخدام الكوبون
    const updateCouponData = {
      coupon_name:coupon.coupon_name,
      coupon_count: coupon.coupon_count - 1,
      coupon_start: coupon.coupon_start,
      coupon_end: coupon.coupon_end,
      coupon_discount: coupon.coupon_discount,
    };

    const result = await updateData(
      "coupon",
      updateCouponData,
      "coupon_id = ?",
      [coupon_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Coupon applied successfully.",
        data: {
          coupon_id,
          ...updateCouponData,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to apply coupon.",
      });
    }
  } catch (error) {
    console.error("Error in applying coupon:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem applying the coupon",
      error: error.message,
    });
  }
}

module.exports = { useDataCoupon };
