const { getAllData, insertData } = require("../../controllers/functions");

async function checkCouponUsage(req, res) {
  try {
    const { coupon_name, user_id } = req.body;

    if (!coupon_name || !user_id) {
      return res.status(400).json({
        status: "failure",
        message: "Coupon name and user ID are required",
      });
    }

    // التحقق مما إذا كان المستخدم قد استخدم هذا الكوبون من قبل
    const whereClause = `
      coupon_name = ? AND user_id = ?
    `;

    const usageResult = await getAllData("coupon_usage", whereClause, [
      coupon_name,
      user_id,
    ]);

    if (usageResult.status === "success" && usageResult.data.length > 0) {
      return res.status(400).json({
        status: "failure",
        message: "You have already used this coupon",
      });
    }

    // إذا لم يتم استخدام الكوبون من قبل، نقوم بتسجيل استخدامه
    const usageData = {
      coupon_name,
      user_id,
      used_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const insertResult = await insertData("coupon_usage", usageData);

    if (insertResult.status === "success") {
      res.json({
        status: "success",
        message: "Coupon usage recorded successfully",
        data: usageData
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to record coupon usage"
      });
    }
  } catch (error) {
    console.error("Error in checking coupon usage:", error);
    res.status(500).json({
      status: "failure",
      message: "There was a problem checking coupon usage",
      error: error.message
    });
  }
}

module.exports = { checkCouponUsage }; 