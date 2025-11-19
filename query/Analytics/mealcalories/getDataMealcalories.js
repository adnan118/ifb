const { getAllData } = require("../../../controllers/functions");

const getDataMealcalories = async (req, res) => {
  try {
    const { mealcalories_user_id } = req.body;

    // حساب التاريخ قبل 6 أيام
    const today = new Date();
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(today.getDate() - 6);
    const sixDaysAgoISO = sixDaysAgo.toISOString().split("T")[0];

    const result = await getAllData(
      "mealcalories",
      "mealcalories_user_id=? AND mealcalories_date_day >= ?",
      [mealcalories_user_id, sixDaysAgoISO]
    );

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "mealcalories fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching mealcalories",
      });
    }
  } catch (error) {
    console.error("Error in getData mealcalories:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataMealcalories,
};
