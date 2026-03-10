const { updateData } = require("../../controllers/functions");

// دالة لتحديث بيانات جدول تدريبي جاهز
async function updateDataReadyTable(req, res) {
  try {
    const { ready_table_id, period_ar, period_en, meal_name_ar, meal_name_en, notes_ar, notes_en } = req.body;

    // التحقق من وجود معرف الجدول
    if (!ready_table_id) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال معرف الجدول",
      });
    }

    // تحديث البيانات في قاعدة البيانات
    const updateDataReadyTable = {};
    
    if (period_ar !== undefined) updateDataReadyTable.period_ar = period_ar;
    if (period_en !== undefined) updateDataReadyTable.period_en = period_en;
    if (meal_name_ar !== undefined) updateDataReadyTable.meal_name_ar = meal_name_ar;
    if (meal_name_en !== undefined) updateDataReadyTable.meal_name_en = meal_name_en;
    if (notes_ar !== undefined) updateDataReadyTable.notes_ar = notes_ar;
    if (notes_en !== undefined) updateDataReadyTable.notes_en = notes_en;

    const result = await updateData(
      "ready_training_tables",
      `ready_table_id = ${ready_table_id}`,
      updateDataReadyTable
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "تم تحديث الجدول التدريبي الجاهز بنجاح",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "فشل تحديث الجدول التدريبي الجاهز",
      });
    }
  } catch (error) {
    console.error("Error updating ready training table data: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في تحديث الجدول التدريبي الجاهز",
      error: error.message,
    });
  }
}

// تصدير الدالة
module.exports = { updateDataReadyTable };
