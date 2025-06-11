const { getAllData } = require("../../../controllers/functions");

const getDataDietType = async (req, res) => {
  try {
    const result = await getAllData('diettype');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Diet types fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching diet types"
      });
    }
  } catch (error) {
    console.error("Error in getDataDietType:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataDietType
}; 