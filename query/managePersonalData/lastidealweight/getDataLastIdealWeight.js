const { getAllData } = require("../../../controllers/functions");

const getDataLastIdealWeight = async (req, res) => {
  try {
    const result = await getAllData('lastidealweight');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Last ideal weight data fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching last ideal weight data"
      });
    }
  } catch (error) {
    console.error("Error in getDataLastIdealWeight:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataLastIdealWeight
}; 