const { deleteData } = require("../../controllers/functions");

async function deleteDataCoupon(req, res) {
  try {
    const { coupon_id } = req.body;

    if (!coupon_id) {
      return res.status(400).json({
        status: "failure",
        message: "Coupon ID is required",
      });
    }

    // حذف البيانات بناءً على coupon_id
    const result = await deleteData("coupon", `coupon_id = ${coupon_id}`);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Coupon data deleted successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete coupon data.",
      });
    }
  } catch (error) {
    console.error("Error in deleting coupon data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting coupon data",
      error: error.message,
    });
  }
}

module.exports = { deleteDataCoupon };
