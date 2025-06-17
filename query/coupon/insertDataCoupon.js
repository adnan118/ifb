const { insertData } = require("../../controllers/functions");

async function insertDataCoupon(req, res) {
  try {
    const { coupon_count, coupon_start, coupon_end, coupon_discount } =
      req.body;

    // تحضير البيانات للإدراج
    const insertCouponData = {
      coupon_count: coupon_count,
      coupon_start: coupon_start,
      coupon_end: coupon_end,
      coupon_discount: coupon_discount,
    };

    const result = await insertData("coupon", insertCouponData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Coupon data inserted successfully.",
        data: insertCouponData,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert coupon data.",
      });
    }
  } catch (error) {
    console.error("Error in inserting coupon data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting coupon data",
      error: error.message,
    });
  }
}

module.exports = { insertDataCoupon };
