const {
  updateData,
  insertData,
  getData,
} = require("../../../controllers/functions");

async function updateOrInsertWorkoutTime(req, res) {
  try {
    const { workouttime_user_id, workouttime_goal, workouttime_value_day, workouttime_date_day } =
      req.body;

    // استخدم التاريخ القادم من التطبيق مباشرة
    const dateDay = workouttime_date_day;

    // 1. التحقق من وجود سجل للقيم لهذا اليوم وuser_id
    const checkResult = await getData(
      "workouttime",
      "workouttime_user_id = ? AND DATE(workouttime_date_day) = ?",
      [workouttime_user_id, dateDay]
    );

    if (
      checkResult.status === "success" &&
      checkResult.data
    ) {
      const existingRecord = checkResult.data;
      // جمع القيمة الجديدة مع القديمة
      const newValue =
        Number(existingRecord.workouttime_value_day || 0) + Number(workouttime_value_day);

      // 2. إذا وجد، قم بالتحديث بالقيمة التراكمية
      const result = await updateData(
        "workouttime",
        {
          workouttime_goal: workouttime_goal,
          workouttime_value_day: newValue,
        },
        "workouttime_user_id = ? AND DATE(workouttime_date_day) = ?",
        [workouttime_user_id, dateDay]
      );

      if (result.status === "success") {
        res.json({
          status: "success",
          message: "Workout time data updated successfully (cumulative).",
          data: { ...result.data, workouttime_value_day: newValue },
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
        workouttime_date_day: dateDay, // التاريخ القادم من التطبيق
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
