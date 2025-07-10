const { getAllData } = require("../../controllers/functions");

const getTrainingCategories = async (req, res) => {
  try {
    const { training_category_idTraining } = req.body;

    // تحقق من وجود training_category_idTraining في الجسم المُرسل
    if (!training_category_idTraining) {
      return res.status(400).json({
        status: "failure",
        message: "training_category_idTraining is required",
      });
    }

    // بناء شرط البحث باستخدام training_category_idTraining
    const whereClause = "training_category_idTraining = ?";
    const values = [training_category_idTraining];

    // جلب البيانات من جدول training_category
    const result = await getAllData("training_category", whereClause, values);

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Training categories fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching training categories",
      });
    }
  } catch (error) {
    console.error("Error in getTrainingCategories:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getTrainingCategories,
};
