const { getAllData } = require("../../../controllers/functions");

const getDataTypicalDay = async (req, res) => {
  try {
    const result = await getAllData('typicalday');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Typical day data fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching typical day data"
      });
    }
  } catch (error) {
    console.error("Error in getDataTypicalDay:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataTypicalDay
}; 