const { getAllData } = require("../../../controllers/functions");

const getDataDailyWater = async (req, res) => {
  try {
    const result = await getAllData('dailywater');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Daily water data fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching daily water data"
      });
    }
  } catch (error) {
    console.error("Error in getDataDailyWater:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataDailyWater
}; 