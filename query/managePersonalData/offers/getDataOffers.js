const { getAllData } = require("../../../controllers/functions");

const getDataOffers = async (req, res) => {
  try {
    const result = await getAllData('offers');
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Offers fetched successfully",
        data: result.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching offers"
      });
    }
  } catch (error) {
    console.error("Error in getDataOffers:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataOffers
}; 