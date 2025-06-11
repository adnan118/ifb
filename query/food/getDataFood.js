const { getAllData } = require("../../controllers/functions");

const getDataFood = async (req, res) => {
  try {
    const result = await getAllData("food");
    
    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "food fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching food",
      });
    }
  } catch (error) {
    console.error("Error in getData food:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getDataFood
}; 