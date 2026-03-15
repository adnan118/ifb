const { insertData, getData } = require("../../controllers/functions");

// دالة لإنشاء جدول تدريبي جديد
async function insertTrainingTable(req, res) {
  try {
    const { name_ar, name_en, description_ar, description_en } = req.body;

    // التحقق من الحقول المطلوبة
    if (!name_ar || !name_en) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال اسم الجدول بالعربية والإنجليزية",
      });
    }

    // إدخال البيانات في قاعدة البيانات
    const insertDataTrainingTable = {
      name_ar: name_ar,
      name_en: name_en,
      description_ar: description_ar || null,
      description_en: description_en || null,
    };

    const result = await insertData("training_tables", insertDataTrainingTable);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "تم إنشاء الجدول التدريبي بنجاح",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "فشل إنشاء الجدول التدريبي",
      });
    }
  } catch (error) {
    console.error("Error inserting training table: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في إنشاء الجدول التدريبي",
      error: error.message,
    });
  }
}

// دالة لإضافة وجبة لجدول تدريبي
async function insertMealToTable(req, res) {
  try {
    const { 
      table_id, 
      period_ar, 
      period_en, 
      meal_name_ar, 
      meal_name_en, 
      notes_ar, 
      notes_en 
    } = req.body;

    // التحقق من الحقول المطلوبة
    if (!table_id || !period_ar || !period_en || !meal_name_ar || !meal_name_en) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال جميع الحقول المطلوبة",
      });
    }

    // التحقق من وجود الجدول الرئيسي
    const tableExists = await getData("training_tables", "table_id = ?", [table_id]);
    if (!tableExists || !tableExists.data) {
      return res.status(404).json({
        status: "failure",
        message: "الجدول الرئيسي غير موجود",
      });
    }

    // إدخال الوجبة في قاعدة البيانات
    const insertMealData = {
      table_id: table_id,
      period_ar: period_ar,
      period_en: period_en,
      meal_name_ar: meal_name_ar,
      meal_name_en: meal_name_en,
      notes_ar: notes_ar || null,
      notes_en: notes_en || null,
    };

    const result = await insertData("training_table_meals", insertMealData);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "تم إضافة الوجبة للجدول التدريبي بنجاح",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "فشل إضافة الوجبة للجدول التدريبي",
      });
    }
  } catch (error) {
    console.error("Error inserting meal to training table: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في إضافة الوجبة للجدول التدريبي",
      error: error.message,
    });
  }
}

module.exports = { insertTrainingTable, insertMealToTable };
