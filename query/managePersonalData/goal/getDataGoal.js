const { getAllData } = require("../../../controllers/functions");

const getDataGoal = async (req, res) => {
  try {
    const result = await getAllData('goals');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Goals fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching goals"
      });
    }
  } catch (error) {
    console.error("Error in getDataGoal:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataGoal
}; 