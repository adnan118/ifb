const {
  updateData,
  insertData,
  getData,
} = require("../../../controllers/functions");

async function updateOrInsertWorkoutTime(req, res) {
  try {
    const { workouttime_user_id, workouttime_goal, workouttime_value_day } = req.body;

    // الحصول على التاريخ بصيغة YYYY-MM-DD
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    // 1. التحقق من وجود سجل لهذا اليوم وuser_id
    const checkResult = await getData(
      "workouttime",
      "workouttime_user_id = ? AND DATE(workouttime_date_day) = ?",
      [workouttime_user_id, todayISO]
    );

    // متغيرات للقيم المجمعة
    let newValueDay = workouttime_value_day;

    if (
      checkResult.status === "success" &&
      checkResult.data !== null &&
      checkResult.data !== undefined
    ) {
      const existingRecord = checkResult.data;

      // استرجاع القيم الحالية، وتحويلها لأرقام عشريه
      const currentValue = parseFloat(existingRecord.workouttime_value_day);
      const newInputValue = parseFloat(workouttime_value_day);

      // جمع القيم العشرية
      newValueDay = currentValue + newInputValue;

      // 2. تحديث قيمة `workouttime_value_day`
      const result = await updateData(
        "workouttime",
        {
          workouttime_value_day: newValueDay,
        },
        "workouttime_user_id = ? AND DATE(workouttime_date_day) = ?",
        [workouttime_user_id, todayISO]
      );

      if (result.status === "success") {
        res.json({
          status: "success",
          message: "تم تحديث زمن التمرين اليومي بنجاح (تمت الإضافة).",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "فشل في تحديث زمن التمرين اليومي.",
        });
      }
    } else {
      // إذا لم يوجد سجل، أدخل سجل جديد
      const insertResult = await insertData("workouttime", {
        workouttime_user_id: workouttime_user_id,
        workouttime_goal: workouttime_goal, // ثابت، لا يتغير
        workouttime_value_day: workouttime_value_day,
        workouttime_date_day: todayISO,
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
    console.error("خطأ في updateOrInsertWorkoutTime:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem processing your request.",
    });
  }
}

module.exports = { updateOrInsertWorkoutTime };
