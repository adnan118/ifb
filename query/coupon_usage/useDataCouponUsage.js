const { updateData, getAllData, insertData } = require("../../controllers/functions");

async function useDataCouponUsage(req, res) {
  try {
    let { coupon_name, user_id } = req.body;

    if (!coupon_name || !user_id) {
      return res.status(400).json({
        status: "failure",
        message: "Coupon name and user ID are required",
      });
    }

    // صياغة التاريخ بصيغة yyyy-mm-dd
    const nowDate = new Date().toISOString().split("T")[0];
    coupon_name = coupon_name.trim(); // إزالة الفراغات

    // 1. التحقق من صلاحية الكوبون
    const whereClause = `
      coupon_count > 0
      AND coupon_end >= ?
      AND coupon_name = ?
    `;

    const validCouponResult = await getAllData("coupon", whereClause, [
      nowDate,
      coupon_name,
    ]);

    if (
      validCouponResult.status !== "success" ||
      !validCouponResult.data ||
      validCouponResult.data.length === 0
    ) {
      return res.status(400).json({
        status: "failure",
        message: "Invalid or expired coupon",
      });
    }

    // 2. التحقق من استخدام الكوبون سابقاً
    const usageCheckClause = `
      coupon_name = ? AND user_id = ?
    `;

    const usageResult = await getAllData("coupon_usage", usageCheckClause, [
      coupon_name,
      user_id,
    ]);

    if (usageResult.status === "success" && usageResult.data.length > 0) {
      return res.status(400).json({
        status: "failure",
        message: "You have already used this coupon",
      });
    }

    const coupon = validCouponResult.data[0];

    // 3. تسجيل استخدام الكوبون
    const usageData = {
      coupon_name,
      user_id,
      used_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    const insertResult = await insertData("coupon_usage", usageData);
    if (insertResult.status !== "success") {
      return res.status(500).json({
        status: "failure",
        message: "Failed to record coupon usage",
      });
    }

    // 4. تحديث عدد مرات استخدام الكوبون
    const updateCouponData = {
      coupon_count: coupon.coupon_count - 1,
    };

    const result = await updateData(
      "coupon",
      updateCouponData,
      "coupon_id = ?",
      [coupon.coupon_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Coupon applied successfully.",
        data: {
          coupon_id: coupon.coupon_id,
          remaining_uses: updateCouponData.coupon_count,
          used_at: usageData.used_at
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

module.exports = { useDataCouponUsage };
