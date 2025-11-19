const { getAllData } = require("../../../controllers/functions");

const getDataRestNight = async (req, res) => {
  try {
    const result = await getAllData('restnight');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Rest night data fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching rest night data"
      });
    }
  } catch (error) {
    console.error("Error in getDataRestNight:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataRestNight
}; 