const { getAllData } = require("../../controllers/functions");

const getDataExercise = async (req, res) => {
  try {
    const { exercise_idCategoryTraining } = req.query; // أو req.params إذا كانت بشكل URL

    if (!exercise_idCategoryTraining) {
      return res.status(400).json({
        status: "failure",
        message: "exercise_idCategoryTraining is required"
      });
    }

    const result = await getAllData(
      'exercise',
      'exercise_idCategoryTraining = ?',
      [exercise_idCategoryTraining]
    );

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Exercises fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching exercises"
      });
    }
  } catch (error) {
    console.error("Error in getDataExercise:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataExercise
};
