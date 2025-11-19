const { deleteData, getData } = require("../../controllers/functions");

async function deleteDataUserFood(req, res) {
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
    const userFoodData = await getData("user_foods", "id = ?", [id]);

    if (userFoodData.status !== "success" || !userFoodData.data) {
      return res.status(404).json({
        status: "failure",
        message: "User food record not found",
      });
    }

    // حذف السجل من قاعدة البيانات
    const result = await deleteData("user_foods", "id = ?", [id]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "User food deleted successfully.",
        data: {
          id,
          ...userFoodData.data,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to delete user food.",
      });
    }
  } catch (error) {
    console.error("Error deleting user food data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting user food",
      error: error.message,
    });
  }
}

module.exports = { deleteDataUserFood };