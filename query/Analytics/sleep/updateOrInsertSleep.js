const {
  updateData,
  insertData,
  getData,
} = require("../../../controllers/functions");

async function updateOrInsertSleep(req, res) {
  try {
    const { sleep_user_id, sleep_goal, sleep_value_day } = req.body;

    // الحصول على التاريخ بصيغة YYYY-MM-DD
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    // 1. التحقق من وجود سجل لهذا اليوم وuser_id
    const checkResult = await getData(
      "sleep",
      "sleep_user_id = ? AND DATE(sleep_date_day) = ?",
      [sleep_user_id, todayISO]
    );

    if (
      checkResult.status === "success" &&
      checkResult.data &&
      checkResult.data.length > 0
    ) {
      // 2. إذا وجد، قم بالتحديث
      const result = await updateData(
        "sleep",
        {
          sleep_goal: sleep_goal,
          sleep_value_day: sleep_value_day,
        },
        "sleep_user_id = ? AND DATE(sleep_date_day) = ?",
        [sleep_user_id, todayISO]
      );

      if (result.status === "success") {
        res.json({
          status: "success",
          message: "Sleep data updated successfully.",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to update sleep data.",
        });
      }
    } else {
      // 3. إذا لم يوجد سجل، قم بالإضافة
      const insertResult = await insertData("sleep", {
        sleep_user_id,
        sleep_goal,
        sleep_value_day,
        sleep_date_day: todayISO,
      });

      if (insertResult.status === "success") {
        res.json({
          status: "success",
          message: "New sleep record inserted successfully.",
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to insert new sleep record.",
        });
      }
    }
  } catch (error) {
    console.error("Error in updateOrInsertSleep:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem processing your request.",
    });
  }
}

module.exports = { updateOrInsertSleep };
