const {
  updateData, 
  getData,
} = require("../../controllers/functions");
 

 
 
 
async function updateAvailabilityTraining(req, res) {
  try {
    const { trainings_id } = req.body;

    const updateTrainingData = {
      trainings_id: trainings_id,
      active: 0,
    };

    const result = await updateData(
      "user_trainings",
      updateTrainingData,
      "trainings_id = ?",
      [trainings_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Training data updated successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update training data.",
      });
    }
  } catch (error) {
    console.error("Error updating training data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating training data",
    });
  }
}

// تصدير الدالة
module.exports = { updateAvailabilityTraining };
  