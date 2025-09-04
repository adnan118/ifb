const { deleteData } = require("../../controllers/functions");

async function deleteDataCouponUsage(req, res) {
  try {
    const { id, user_id } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "failure",
        message: "Coupon usage ID is required",
      });
    }

    // بناء شرط الحذف - يمكن إضافة user_id للتأكد من أن المستخدم يحذف بياناته فقط
    let whereClause = `id = ?`;
    let params = [id];

    if (user_id) {
      whereClause += ` AND user_id = ?`;
      params.push(user_id);
    }

    // حذف البيانات بناءً على id
    const result = await deleteData("coupon_usage", whereClause, params);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Coupon usage data deleted successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete coupon usage data.",
      });
    }
  } catch (error) {
    console.error("Error in deleting coupon usage data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting coupon usage data",
      error: error.message,
    });
  }
}

module.exports = { deleteDataCouponUsage };
