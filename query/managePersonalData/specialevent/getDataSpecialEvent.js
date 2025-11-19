const { getAllData } = require("../../../controllers/functions");

const getDataSpecialEvent = async (req, res) => {
  try {
    const result = await getAllData('specialevent');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Special events fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching special events"
      });
    }
  } catch (error) {
    console.error("Error in getDataSpecialEvent:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataSpecialEvent
}; 