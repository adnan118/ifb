const { getAllData } = require("../../controllers/functions");

const getDataMeal = async (req, res) => {
  try {
    const result = await getAllData("mealfastfood");

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Meal fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching meal data",
      });
    }
  } catch (error) {
    console.error("Error in getData meal:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataMeal,
};
