const { getAllData } = require("../../../controllers/functions");

const getDataBadHabits = async (req, res) => {
  try {
    const result = await getAllData('badhabits');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Bad habits fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching bad habits"
      });
    }
  } catch (error) {
    console.error("Error in getDataBadHabits:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataBadHabits
}; 