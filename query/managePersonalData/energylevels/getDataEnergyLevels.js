const { getAllData } = require("../../../controllers/functions");

const getDataEnergyLevels = async (req, res) => {
  try {
    const result = await getAllData('energylevels');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Energy levels fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching energy levels"
      });
    }
  } catch (error) {
    console.error("Error in getDataEnergyLevels:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataEnergyLevels
}; 