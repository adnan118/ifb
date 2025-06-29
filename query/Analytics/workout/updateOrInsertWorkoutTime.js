const {
  updateData,
  insertData,
  getData,
} = require("../../../controllers/functions");

async function updateOrInsertWorkoutTime(req, res) {
  try {
    const {
      workouttime_user_id,
      workouttime_goal,
      workouttime_value_day,
      workouttime_date_day,
    } = req.body;

    // استخدم التاريخ المرسل من التطبيق أو تاريخ السيرفر إذا لم يوجد
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];
    const dateToUse = workouttime_date_day || todayISO;

    // 1. التحقق من وجود سجل للقيم لهذا اليوم وuser_id
    const checkResult = await getData(
      "workouttime",
      "workouttime_user_id = ? AND DATE(workouttime_date_day) = ?",
      [workouttime_user_id, dateToUse]
    );

    if (
      checkResult.status === "success" &&
      checkResult.data !== null &&
      checkResult.data !== undefined 
     
    ) {
      // 2. إذا وجد، قم بالتحديث
      const result = await updateData(
        "workouttime",
        {
          workouttime_goal: workouttime_goal,
          workouttime_value_day: workouttime_value_day,
        },
        "workouttime_user_id = ? AND DATE(workouttime_date_day) = ?",
        [workouttime_user_id, dateToUse]
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
        workouttime_date_day: dateToUse, // التاريخ الصحيح
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
