const { getAllData } = require("../../controllers/functions");

const getDataCouponUsage = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        status: "failure",
        message: "User ID is required",
      });
    }

    // بناء شرط WHERE بحسب user_id فقط
    const whereClause = `user_id = ?`;
    const params = [user_id];

    const result = await getAllData("coupon_usage", whereClause, params);

    if (result.status !== "success") {
      return res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching coupon usage data",
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
