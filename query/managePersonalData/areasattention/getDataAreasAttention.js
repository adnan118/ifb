const { getAllData } = require("../../../controllers/functions");

const getDataAreasAttention = async (req, res) => {
  try {
    const result = await getAllData('areasattention');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Areas attention fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching areas attention"
      });
    }
  } catch (error) {
    console.error("Error in getDataAreasAttention:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataAreasAttention
}; 