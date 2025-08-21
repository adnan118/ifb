const { deleteData, getData } = require("../../controllers/functions");

async function deleteDataUserTraining(req, res) {
  try {
    const { id } = req.body;

    // التحقق من وجود معرف السجل
    if (!id) {
      return res.status(400).json({
        status: "failure",
        message: "Missing required field: id",
      });
    }

    // الحصول على معلومات السجل قبل حذفه
    const userTrainingData = await getData("user_trainings", "id = ?", [id]);

    if (userTrainingData.status !== "success" || !userTrainingData.data) {
      return res.status(404).json({
        status: "failure",
        message: "User training record not found",
      });
    }

    // حذف السجل من قاعدة البيانات
    const result = await deleteData("user_trainings", "id = ?", [id]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "User training deleted successfully.",
        data: {
          id,
          ...userTrainingData.data,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete user training.",
      });
    }
  } catch (error) {
    console.error("Error deleting user training data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting user training",
      error: error.message,
    });
  }
}

module.exports = { deleteDataUserTraining };