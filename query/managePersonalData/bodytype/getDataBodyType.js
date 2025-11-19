const { getAllData } = require("../../../controllers/functions");

const getDataBodyType = async (req, res) => {
  try {
    const result = await getAllData('bodytype');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Body types fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching body types"
      });
    }
  } catch (error) {
    console.error("Error in getDataBodyType:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataBodyType
}; 