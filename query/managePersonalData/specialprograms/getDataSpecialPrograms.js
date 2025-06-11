const { getAllData } = require("../../../controllers/functions");

const getDataSpecialPrograms = async (req, res) => {
  try {
    const result = await getAllData('specialprograms');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Special programs fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching special programs"
      });
    }
  } catch (error) {
    console.error("Error in getDataSpecialPrograms:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataSpecialPrograms
}; 