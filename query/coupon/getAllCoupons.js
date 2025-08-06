const { getAllData } = require("../../controllers/functions");

const getAllCoupons = async (req, res) => {
  try {
    // جلب جميع الكوبونات بدون أي شروط
    const result = await getAllData("coupon");

    if (result.status !== "success") {
      return res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching all coupons",
      });
    }

    res.status(200).json({
      status: "success",
      message: "All coupons fetched successfully.",
      data: result.data,
      count: result.data.length
    });
  } catch (error) {
    console.error("Error in getAllCoupons:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { getAllCoupons }; 
