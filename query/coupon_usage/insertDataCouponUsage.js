const { insertData } = require("../../controllers/functions");

async function insertDataCouponUsage(req, res) {
  try {
    const { coupon_name, user_id } = req.body;

    if (!coupon_name || !user_id) {
      return res.status(400).json({
        status: "failure",
        message: "Coupon name and user ID are required",
      });
    }

    // تحضير البيانات للإدراج
    const insertCouponUsageData = {
      coupon_name: coupon_name.trim(),
      user_id: user_id,
      used_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const result = await insertData("coupon_usage", insertCouponUsageData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Coupon usage data inserted successfully.",
        data: insertCouponUsageData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert coupon usage data.",
      });
    }
  } catch (error) {
    console.error("Error in inserting coupon usage data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting coupon usage data",
      error: error.message,
    });
  }
}

module.exports = { insertDataCouponUsage };
