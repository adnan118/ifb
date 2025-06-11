const { getAllData } = require("../../controllers/functions");

const getDataTraining = async (req, res) => {
  try {
    const result = await getAllData('trainings');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Trainings fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching trainings"
      });
    }
  } catch (error) {
    console.error("Error in getDataTraining:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataTraining
}; 