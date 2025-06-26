const { getAllData } = require("../../controllers/functions");

const getDataTraining = async (req, res) => {
  try {
    const { training_activities_id, trainings_id } = req.body;

    if (!training_activities_id) {
      return res.status(400).json({
        status: "failure",
        message: "training_activities_id is required",
      });
    }

    let whereClause = "training_activities_id = ?";
    const values = [training_activities_id];

    // التعامل مع trainings_id كمصفوفة
    let trainingsArray = [];

    if (trainings_id !== undefined) {
      // إذا كانت غير مصفوفة، حاول تحويلها لمصفوفة
      if (!Array.isArray(trainings_id)) {
        // إذا كانت رقم أو سلسلة، حولها لمصفوفة
        trainingsArray = [trainings_id];
      } else {
        trainingsArray = trainings_id;
      }

      // إذا كانت المصفوفة تحتوي على 0، تجاهل الشرط
      if (trainingsArray.includes(0)) {
        // لا نضيف شرط trainings_id
      } else if (trainingsArray.length > 0) {
        // بناء شرط IN
        whereClause +=
          " AND trainings_id IN (" +
          trainingsArray.map(() => "?").join(",") +
          ")";
        values.push(...trainingsArray);
      }
      // إذا كانت المصفوفة فارغة، لا نضيف شرط
    }

    const result = await getAllData("trainings", whereClause, values);

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Trainings fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching trainings",
      });
    }
  } catch (error) {
    console.error("Error in getDataTraining:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataTraining,
};
