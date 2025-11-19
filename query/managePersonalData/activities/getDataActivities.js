const { getAllData } = require("../../../controllers/functions");

const getDataActivities = async (req, res) => {
  try {
    const result = await getAllData('activities');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Activities fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching activities"
      });
    }
  } catch (error) {
    console.error("Error in getDataActivities:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataActivities
}; 