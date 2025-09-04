const { getAllData } = require("../../controllers/functions");

const getDataCouponUsage = async (req, res) => {
  try {
    let { user_id, coupon_name } = req.query;

    if (!user_id) {
      return res.status(400).json({
        status: "failure",
        message: "User ID is required",
      });
    }

    // بناء شرط WHERE
    let whereClause = `user_id = ?`;
    const params = [user_id];

    // إذا تم توفير coupon_name، أضف الشرط
    if (coupon_name) {
      coupon_name = coupon_name.trim();
      whereClause += ` AND coupon_name = ?`;
      params.push(coupon_name);
    }

    const result = await getAllData("coupon_usage", whereClause, params);

    if (result.status !== "success") {
      return res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching coupon usage data",
      });
    }

    // إذا تم تقديم coupon_name ولم يتم العثور على البيانات
    if (coupon_name && result.data.length === 0) {
      return res.status(404).json({
        status: "failure",
        message: "Coupon usage not found for this user.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Coupon usage data fetched successfully.",
      data: result.data,
    });
  } catch (error) {
    console.error("Error in getCouponUsage:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { getDataCouponUsage };
