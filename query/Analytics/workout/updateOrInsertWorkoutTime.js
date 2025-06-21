const {
  updateData,
  insertData,
  getData,
} = require("../../../controllers/functions");

async function updateOrInsertWorkoutTime(req, res) {
  try {
    const { workouttime_user_id, workouttime_goal, workouttime_value_day } = req.body;

    // الحصول على التاريخ بصيغة YYYY-MM-DD مع وقت 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0); // يعين الوقت إلى 00:00:00
    const todayISO = today.toISOString().split('T')[0]; // فقط التاريخ
    const todayDateTime = today.toISOString().replace('T', ' ').split('.')[0]; // التاريخ مع الوقت بصيغة "YYYY-MM-DD HH:MM:SS"

    // التحقق من وجود سجل مطابق للمستخدم والتاريخ
    const checkResult = await getData(
      "workouttime",
      "workouttime_user_id = ? AND DATE(workouttime_date_day) = ?",
      [workouttime_user_id, todayISO]
    );

    if (checkResult.status === "success" && checkResult.data && checkResult.data.length > 0) {
      // إذا وجد سجل، يتم التحديث
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
          message: "تم تحديث بيانات التمرين بنجاح.",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "فشل في تحديث بيانات التمرين.",
        });
      }
    } else {
      // إذا لم يوجد سجل، نقوم بالإدراج
      const insertResult = await insertData("workouttime", {
        workouttime_user_id: workouttime_user_id,
        workouttime_goal: workouttime_goal,
        workouttime_value_day: workouttime_value_day,
        workouttime_date_day: todayISO, // التاريخ بصيغة "YYYY-MM-DD"
      });

      if (insertResult.status === "success") {
        res.json({
          status: "success",
          message: "تم إدخال سجل جديد لوقت التمرين بنجاح.",
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "فشل في إدخال سجل جديد لوقت التمرين.",
        });
      }
    }
  } catch (error) {
    console.error("خطأ في الدالة updateOrInsertWorkoutTime:", error);
    res.status(500).json({
      status: "failure",
      message: "حدثت مشكلة أثناء معالجة الطلب.",
    });
  }
}

module.exports = { updateOrInsertWorkoutTime };
