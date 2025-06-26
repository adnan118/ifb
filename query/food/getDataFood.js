const { getAllData } = require("../../controllers/functions");

const getDataFood = async (req, res) => {
  try {
    const { food_diettype_id } = req.body; // أو req.params حسب طريقة الاستلام
    if (!food_diettype_id) {
      return res.status(400).json({
        status: "failure",
        message: "food_diettype_id is required",
      });
    }

    const result = await getAllData(
      "food",
      "food_diettype_id = ?", // شرط where
      [food_diettype_id] // القيم المعطاة للشرط
    );

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Food fetched successfully",
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
      error: error.message,
    });
  }
};

module.exports = {
  getDataFood,
};