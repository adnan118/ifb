 

const {
  updateData,
  insertData,
  getData,
} = require("../../../controllers/functions");

async function updateOrInsertSteps(req, res) {
  try {
    const { steps_user_id, steps_goal, steps_value_day } = req.body;

    // الحصول على التاريخ بصيغة YYYY-MM-DD
    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    // 1. التحقق من وجود سجل لقيم اليوم وuser_id
    const checkResult = await getData(
      "steps",
      "steps_user_id = ? AND DATE(steps_date_day) = ?",
      [steps_user_id, todayISO]
    ); 

    
    console.error("Error in updateOrInsertSteps:", today);
    console.error("Error in updateOrInsertSteps:", todayISO);
    // في قسم التحقق من وجود سجل وتحديثه
if (checkResult.status === "success" && checkResult.data) {
  
  // تحضير البيانات للتحديث
  const updateFields = {};

  // تحديث القيمة إذا كانت غير فارغة
  if (steps_goal !== "") {
    updateFields.steps_goal = steps_goal;
  }

  if (steps_value_day !== "") {
    updateFields.steps_value_day = steps_value_day;
  }

  // فقط إذا كان هناك شيء لتحديث
  if (Object.keys(updateFields).length > 0) {
    const result = await updateData(
      "steps",
      updateFields,
      "steps_user_id = ? AND DATE(steps_date_day) = ?",
      [steps_user_id, todayISO]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Steps data updated successfully.",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update steps data.",
      });
    }
  } else {
    // إذا لم توجد قيم لتحديثها
    res.json({
      status: "success",
      message: "No changes made since all input values are empty.",
    });
  }
}  
    else {
      // 3. إذا لم يوجد سجل، قم بالإضافة
      const insertResult = await insertData("steps", {
        steps_user_id: steps_user_id,
        steps_goal: steps_goal,
        steps_value_day: steps_value_day,
        steps_date_day: todayISO, // أو حسب الحاجة
      });

      if (insertResult.status === "success") {
        res.json({
          status: "success",
          message: "New steps record inserted successfully.",
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to insert new steps record.",
        });
      }
    }
  } catch (error) {
    console.error("Error in updateOrInsertSteps:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem processing your request.",
    });
  }
}

module.exports = { updateOrInsertSteps };

 