const {
  updateData,
  insertData,
  getData,
} = require("../../../controllers/functions");

async function updateOrInsertMealCalories(req, res) {
  try {
    const { mealcalories_user_id, mealcalories_goal, mealcalories_value_day } =
      req.body;

    // الحصول على التاريخ بصيغة YYYY-MM-DD
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    // 1. التحقق من وجود سجل لهذا اليوم وuser_id
    const checkResult = await getData(
      "mealcalories",
      "mealcalories_user_id = ? AND DATE(mealcalories_date_day) = ?",
      [mealcalories_user_id, todayISO]
    );

    if (
      checkResult.status === "success" &&
      checkResult.data &&
      checkResult.data.length > 0
    ) {
      // 2. إذا وجد، قم بالتحديث
      const result = await updateData(
        "mealcalories",
        {
          mealcalories_goal: mealcalories_goal,
          mealcalories_value_day: mealcalories_value_day,
        },
        "mealcalories_user_id = ? AND DATE(mealcalories_date_day) = ?",
        [mealcalories_user_id, todayISO]
      );

      if (result.status === "success") {
        res.json({
          status: "success",
          message: "Meal calories data updated successfully.",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to update meal calories data.",
        });
      }
    } else {
      // 3. إذا لم يوجد سجل، قم بالإضافة
      const insertResult = await insertData("mealcalories", {
        mealcalories_user_id,
        mealcalories_goal,
        mealcalories_value_day,
        mealcalories_date_day: todayISO,
      });

      if (insertResult.status === "success") {
        res.json({
          status: "success",
          message: "New meal calories record inserted successfully.",
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to insert new meal calories record.",
        });
      }
    }
  } catch (error) {
    console.error("Error in updateOrInsertMealCalories:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem processing your request.",
    });
  }
}

module.exports = { updateOrInsertMealCalories };
