const {
  updateData,
  insertData,
  getData,
} = require("../../../controllers/functions");

async function updateOrInsertWorkoutTime(req, res) {
  try {
    const { workouttime_user_id, workouttime_goal, workouttime_value_day, workouttime_date_day } = req.body;

    // استخدم التاريخ المرسل أو تاريخ السيرفر
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];
    const dateToUse = workouttime_date_day || todayISO;

    // 1. التحقق من وجود سجل لهذا اليوم وuser_id
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
      // سجل موجود: اجمع القيمة القديمة مع الجديدة
      const existingRecord = checkResult.data[0];
      const oldValue = Number(existingRecord.workouttime_value_day) || 0;
      const newValue = Number(workouttime_value_day) || 0;
      const totalValue = oldValue + newValue;

      const result = await updateData(
        "workouttime",
        {
          workouttime_goal: workouttime_goal,
          workouttime_value_day: totalValue, // اجمع القيمتين
        },
        "workouttime_user_id = ? AND DATE(workouttime_date_day) = ?",
        [workouttime_user_id, dateToUse]
      );

      if (result.status === "success") {
        res.json({
          status: "success",
          message: "Workout time data updated successfully (accumulated).",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to update workout time data.",
        });
      }
    } else {
      // لا يوجد سجل: أضف سجل جديد
      const insertResult = await insertData("workouttime", {
        workouttime_user_id: workouttime_user_id,
        workouttime_goal: workouttime_goal,
        workouttime_value_day: workouttime_value_day,
        workouttime_date_day: dateToUse,
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
