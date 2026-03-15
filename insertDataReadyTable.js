const { insertData } = require("../../controllers/functions");

// دالة لإدخال بيانات جدول تدريبي جاهز
async function insertDataReadyTable(req, res) {
  try {
    const { period_ar, period_en, meal_name_ar, meal_name_en, notes_ar, notes_en } = req.body;

    // التحقق من الحقول المطلوبة
    if (!period_ar || !period_en || !meal_name_ar || !meal_name_en) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال الفترة بالعربية والإنجليزية واسم الوجبة بالعربية والإنجليزية",
      });
    }

    // إدخال البيانات في قاعدة البيانات
    const insertDataReadyTable = {
      period_ar: period_ar,
      period_en: period_en,
      meal_name_ar: meal_name_ar,
      meal_name_en: meal_name_en,
      notes_ar: notes_ar || null,
      notes_en: notes_en || null,
    };

    const result = await insertData("ready_training_tables", insertDataReadyTable);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "تم إضافة الجدول التدريبي الجاهز بنجاح",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "فشل إضافة الجدول التدريبي الجاهز",
      });
    }
  } catch (error) {
    console.error("Error inserting ready training table data: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في إضافة الجدول التدريبي الجاهز",
      error: error.message,
    });
  }
}

// تصدير الدالة
module.exports = { insertDataReadyTable };
