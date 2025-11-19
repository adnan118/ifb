const { getAllData } = require("../../../controllers/functions");

const getDataSteps = async (req, res) => {
  try {
    const { steps_user_id } = req.body;

    // حساب التاريخ قبل 6 أيام
    const today = new Date();
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(today.getDate() - 6);
    const sixDaysAgoISO = sixDaysAgo.toISOString().split("T")[0];

    const result = await getAllData(
      "steps",
      "steps_user_id=? AND steps_date_day >= ?",
      [steps_user_id, sixDaysAgoISO]
    );

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Steps fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching Steps",
      });
    }
  } catch (error) {
    console.error("Error in getData Steps:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataSteps,
};
