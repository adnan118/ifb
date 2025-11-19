const { updateData, getData } = require("../../controllers/functions");

async function updateDataUserFood(req, res) {
  try {
    const { id, user_id, food_id, daysOfWeek_id } = req.body;

    // التحقق من وجود معرف السجل
    if (!id) {
      return res.status(400).json({
        status: "failure",
        message: "Missing required field: id",
      });
    }

    // التحقق من وجود السجل
    const existingRecord = await getData("user_foods", "id = ?", [id]);
    
    if (existingRecord.status !== "success" || !existingRecord.data) {
      return res.status(404).json({
        status: "failure",
        message: "User food record not found",
      });
    }

    // إعداد بيانات التحديث (فقط الحقول المرسلة)
    const updateUserFoodData = {};
    
    if (user_id !== undefined) updateUserFoodData.user_id = user_id;
    if (food_id !== undefined) updateUserFoodData.food_id = food_id;
    if (daysOfWeek_id !== undefined) updateUserFoodData.daysOfWeek_id = daysOfWeek_id;

    // التحقق من وجود بيانات للتحديث
    if (Object.keys(updateUserFoodData).length === 0) {
      return res.status(400).json({
        status: "failure",
        message: "No data provided for update",
      });
    }

    const result = await updateData(
      "user_foods",
      updateUserFoodData,
      "id = ?",
      [id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "User food updated successfully.",
        data: {
          id,
          ...updateUserFoodData,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update user food.",
      });
    }
  } catch (error) {
    console.error("Error updating user food data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating user food",
      error: error.message,
    });
  }
}

module.exports = { updateDataUserFood };