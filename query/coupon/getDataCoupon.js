const { getAllData } = require("../../controllers/functions");

const getValidCoupons = async (req, res) => {
  try {
    let { coupon_name } = req.query;

    if (coupon_name) {
      coupon_name = coupon_name.trim(); // إزالة الفراغات
    }

    // صياغة التاريخ بصيغة yyyy-mm-dd
    const nowDate = new Date().toISOString().split("T")[0];

    // بناء شرط WHERE
    const whereClause = `
      coupon_count > 0
      AND coupon_end >= ?
      ${coupon_name ? "AND LOWER(coupon_id) = LOWER(?)" : ""}
    `;

    // إعداد المعاملات
    const params = [nowDate];
    if (coupon_name) {
      params.push(coupon_name);
    }

    const result = await getAllData("coupon", whereClause, params);

    if (result.status !== "success") {
      return res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching coupons",
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

module.exports = { getValidCoupons };
