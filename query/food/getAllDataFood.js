const { getAllData } = require("../../controllers/functions");

/**
 * جلب جميع أطعمة بدون شروط
 * لا يعتمد على food_diettype_id أو user_id
 */
const getAllFood = async (req, res) => {
  try {
    // يمكن إضافة عمليات تحقق بسيطة إن لزم
    const result = await getAllData(
      "food",
      "", // بدون شرط
      []
    );

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "All foods fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching foods",
      });
    }
  } catch (error) {
    console.error("Error in getAllFood:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllFood,
};
