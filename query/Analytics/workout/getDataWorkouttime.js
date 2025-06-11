const { getAllData } = require("../../../controllers/functions");

const getDataWorkouttime = async (req, res) => {
  try {
    const { workouttime_user_id } = req.body;

    // حساب تاريخ اليوم قبل 6 أيام
    const today = new Date();
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(today.getDate() - 6);
    const sixDaysAgoISO = sixDaysAgo.toISOString().split("T")[0];

    const result = await getAllData(
      "workouttime",
      "workouttime_user_id=? AND workouttime_date_day >= ?",
      [workouttime_user_id, sixDaysAgoISO]
    );

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "workouttime fetched successfully",
        data: result.data,
      });
      console.log("workouttime fetched successfully");
      console.log(result.data); 

    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching workouttime",
      }); 

    }
  } catch (error) {
    console.error("Error in getData workouttime:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataWorkouttime,
};
