const { getAllData } = require("../../../controllers/functions");

const getDataPhysicallyActive = async (req, res) => {
  try {
    const result = await getAllData('physicallyactive');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Physically active data fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching physically active data"
      });
    }
  } catch (error) {
    console.error("Error in getDataPhysicallyActive:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataPhysicallyActive
}; 