const { getAllData } = require("../../controllers/functions");

const getTrainingsByActivityId = async (req, res) => {
  try {
    const { activite_id } = req.body;

    // التحقق من وجود activite_id
    if (!activite_id) {
      return res.status(400).json({
        status: "failure",
        message: "activite_id is required",
      });
    }

    // جلب جميع التدريبات حسب activite_id
    const result = await getAllData(
      "trainings",
      "training_activities_id = ?",
      [activite_id]
    );

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Trainings fetched successfully by activity ID",
        data: result.data,
        count: result.data.length,
        activity_id: activite_id
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching trainings by activity ID",
      });
    }
  } catch (error) {
    console.error("Error in getTrainingsByActivityId:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { getTrainingsByActivityId }; 
