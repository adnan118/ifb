const {
  updateData,
  insertData,
  getData,
} = require("../../../controllers/functions");

async function updateOrInsertWorkoutTime(req, res) {
  try {
    const { workouttime_user_id, workouttime_goal, workouttime_value_day } =
      req.body;

    // الحصول على التاريخ بصيغة YYYY-MM-DD
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    // 1. التحقق من وجود سجل للقيم لهذا اليوم وuser_id
    const checkResult = await getData(
      "workouttime",
      "workouttime_user_id = ? AND DATE(workouttime_date_day) = ?",
      [workouttime_user_id, todayISO]
    );

    if (
      
      checkResult.data  
    ) {
      const existingRecord = checkResult.data[0]; // نفترض أن هناك سجل واحد، أو يمكنك التحقق من المنطق حسب الحاجة

      // 2. إذا وجد، قم بالتحديث
      const result = await updateData(
        "workouttime",
        {
          workouttime_goal: workouttime_goal,
          workouttime_value_day: workouttime_value_day,
        },
        "workouttime_user_id = ? AND DATE(workouttime_date_day) = ?",
        [workouttime_user_id, todayISO]
      );

      if (result.status === "success") {
        res.json({
          status: "success",
          message: "Workout time data updated successfully.",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to update workout time data.",
        });
      }
    } else {
      // 3. إذا لم يوجد سجل، قم بالإضافة
      const insertResult = await insertData("workouttime", {
        workouttime_user_id: workouttime_user_id,
        workouttime_goal: workouttime_goal,
        workouttime_value_day: workouttime_value_day,
        workouttime_date_day: todayISO, // التاريخ
      });

      if (insertResult.status === "success") {
        res.json({
          status: "success",
          message: "New workout time record inserted successfully.",
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to insert new workout time record.",
        });
      }
    }
  } catch (error) {
    console.error("Error in updateOrInsertWorkoutTime:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem processing your request.",
    });
  }
}

module.exports = { updateOrInsertWorkoutTime };
