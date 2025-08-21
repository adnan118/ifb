
const { updateData, getData } = require("../../controllers/functions");

async function updateDataUserTraining(req, res) {
  try {
    const { id, user_id, training_id, daysOfWeek_id, active } = req.body;

    // التحقق من وجود معرف السجل
    if (!id) {
      return res.status(400).json({
        status: "failure",
        message: "Missing required field: id",
      });
    }

    // التحقق من وجود السجل
    const existingRecord = await getData("user_trainings", "id = ?", [id]);
    
    if (existingRecord.status !== "success" || !existingRecord.data) {
      return res.status(404).json({
        status: "failure",
        message: "User training record not found",
      });
    }

    // إعداد بيانات التحديث (فقط الحقول المرسلة)
    const updateUserTrainingData = {};
    
    if (user_id !== undefined) updateUserTrainingData.user_id = user_id;
    if (training_id !== undefined) updateUserTrainingData.training_id = training_id;
    if (daysOfWeek_id !== undefined) updateUserTrainingData.daysOfWeek_id = daysOfWeek_id;
    if (active !== undefined) updateUserTrainingData.active = active;

    // التحقق من وجود بيانات للتحديث
    if (Object.keys(updateUserTrainingData).length === 0) {
      return res.status(400).json({
        status: "failure",
        message: "No data provided for update",
      });
    }

    const result = await updateData(
      "user_trainings",
      updateUserTrainingData,
      "id = ?",
      [id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "User training updated successfully.",
        data: {
          id,
          ...updateUserTrainingData,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update user training.",
      });
    }
  } catch (error) {
    console.error("Error updating user training data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating user training",
      error: error.message,
    });
  }
}


module.exports = { updateDataUserTraining };


