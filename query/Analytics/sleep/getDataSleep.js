const { getAllData } = require("../../../controllers/functions");

const getDataSleep = async (req, res) => {
  try {
    const { sleep_user_id } = req.body;

    // حساب تاريخ اليوم قبل 6 أيام
    const today = new Date();
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(today.getDate() - 6);
    const sixDaysAgoISO = sixDaysAgo.toISOString().split("T")[0];

    const result = await getAllData(
      "sleep",
      "sleep_user_id=? AND sleep_date_day >= ?",
      [sleep_user_id, sixDaysAgoISO]
    );

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "sleep fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching sleep",
      });
    }
  } catch (error) {
    console.error("Error in getData sleep:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataSleep,
};
