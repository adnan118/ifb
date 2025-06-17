const { getAllData } = require("../../controllers/functions");

const getDataCoupon = async (req, res) => {
  try {
    let { coupon_name } = req.query;

    if (coupon_name) {
      coupon_name = coupon_name.trim(); // إزالة الفراغات
    }

    // صياغة التاريخ بصيغة yyyy-mm-dd
    const nowDate = new Date().toISOString().split("T")[0];

    // بناء شرط WHERE
    let whereClause = `
      coupon_count > 0
      AND coupon_end >= ?
  
    `;
    const params = [nowDate];

    // إذا تم توفير coupon_name، أضف الشرط بطريقة حساسـة لحالة الحروف
    if (coupon_name) {
      whereClause += ` AND coupon_name = ?`;
      params.push(coupon_name);
    }

    const result = await getAllData("coupon", whereClause, params);

    if (result.status !== "success") {
      return res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching coupons",
      });
    }

    // إذا تم تقديم coupon_name ولم يتم العثور على الكوبونات
    if (coupon_name && result.data.length === 0) {
      return res.status(404).json({
        status: "failure",
        message: "Coupon not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Available coupons fetched successfully.",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in getValidCoupons:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { getDataCoupon };
