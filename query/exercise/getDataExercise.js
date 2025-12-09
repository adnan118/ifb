/*const { getAllData } = require("../../controllers/functions");

const getDataExercise = async (req, res) => {
  try {
    const { exercise_idTraining } = req.body;  

    if (!exercise_idTraining) {
      return res.status(400).json({
        status: "failure",
        message: "exercise_idTraining is required",
      });
    }

    const result = await getAllData("exercise", "exercise_idTraining = ?", [
      exercise_idTraining,
    ]);

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Exercises fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching exercises",
      });
    }
  } catch (error) {
    console.error("Error in getDataExercise:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataExercise,
};
*/
const { getAllData, getData } = require("../../controllers/functions");

// Function to normalize gender values
const normalizeGender = (gender) => {
  if (!gender) return null;
  
  // Handle numeric gender IDs
  if (typeof gender === 'number') {
    if (gender === 1) return 'Male';
    if (gender === 2) return 'FeMale';
    return null;
  }
  
  // Handle string gender values
  const normalized = gender.toString().toLowerCase().trim();
  
  // Handle different forms of female
  if (['female', 'femal', 'أنثى', 'انثى', 'feMale', 'female'].includes(normalized)) {
    return 'FeMale';
  }
  
  // Handle different forms of male
  if (['male', 'ذكر', 'male'].includes(normalized)) {
    return 'Male';
  }
  
  return null;
};

const getDataExercise = async (req, res) => {
  try {
    const { exercise_idTraining, gender } = req.body;

    if (!exercise_idTraining) {
      return res.status(400).json({
        status: "failure",
        message: "exercise_idTraining is required",
      });
    }

    // Build the query based on whether gender is provided
    let query = "exercise_idTraining = ?";
    let values = [exercise_idTraining];

    // If gender is provided, add gender filtering
    if (gender !== undefined && gender !== null && gender !== '') {
      const normalizedGender = normalizeGender(gender);
      
      if (normalizedGender) {
        // Add gender condition to query
        // Note: This assumes there's a 'gender' column in the exercise table
        // If the column doesn't exist, this query will need to be adjusted
        query += " AND (gender = ? OR gender IS NULL OR gender = '')";
        values.push(normalizedGender);
      }
    }

    const result = await getAllData("exercise", query, values);

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Exercises fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching exercises",
      });
    }
  } catch (error) {
    console.error("Error in getDataExercise:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataExercise,
};
