const { updateData, deleteData } = require("../../controllers/functions");

// دالة لتحديث بيانات جدول تدريبي
async function updateTrainingTable(req, res) {
  try {
    const { table_id, name_ar, name_en, description_ar, description_en } = req.body;

    // التحقق من وجود معرف الجدول
    if (!table_id) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال معرف الجدول",
      });
    }

    // تحديث البيانات في قاعدة البيانات
    const updateDataTable = {};
    
    if (name_ar !== undefined) updateDataTable.name_ar = name_ar;
    if (name_en !== undefined) updateDataTable.name_en = name_en;
    if (description_ar !== undefined) updateDataTable.description_ar = description_ar;
    if (description_en !== undefined) updateDataTable.description_en = description_en;

    const result = await updateData(
      "training_tables",
      `table_id = ${table_id}`,
      updateDataTable
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "تم تحديث الجدول التدريبي بنجاح",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "فشل تحديث الجدول التدريبي",
      });
    }
  } catch (error) {
    console.error("Error updating training table: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في تحديث الجدول التدريبي",
      error: error.message,
    });
  }
}

// دالة لتحديث وجبة في جدول تدريبي
async function updateMealInTable(req, res) {
  try {
    const { 
      meal_id, 
      period_ar, 
      period_en, 
      meal_name_ar, 
      meal_name_en, 
      notes_ar, 
      notes_en 
    } = req.body;

    // التحقق من وجود معرف الوجبة
    if (!meal_id) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال معرف الوجبة",
      });
    }

    // تحديث البيانات في قاعدة البيانات
    const updateDataMeal = {};
    
    if (period_ar !== undefined) updateDataMeal.period_ar = period_ar;
    if (period_en !== undefined) updateDataMeal.period_en = period_en;
    if (meal_name_ar !== undefined) updateDataMeal.meal_name_ar = meal_name_ar;
    if (meal_name_en !== undefined) updateDataMeal.meal_name_en = meal_name_en;
    if (notes_ar !== undefined) updateDataMeal.notes_ar = notes_ar;
    if (notes_en !== undefined) updateDataMeal.notes_en = notes_en;

    const result = await updateData(
      "training_table_meals",
      `meal_id = ${meal_id}`,
      updateDataMeal
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "تم تحديث الوجبة بنجاح",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "فشل تحديث الوجبة",
      });
    }
  } catch (error) {
    console.error("Error updating meal in training table: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في تحديث الوجبة",
      error: error.message,
    });
  }
}

// دالة لحذف وجبة من جدول تدريبي
async function deleteMealFromTable(req, res) {
  try {
    const { meal_id } = req.body;

    // التحقق من وجود معرف الوجبة
    if (!meal_id) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال معرف الوجبة",
      });
    }

    // حذف الوجبة من قاعدة البيانات
    const result = await deleteData(
      "training_table_meals",
      `meal_id = ${meal_id}`
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "تم حذف الوجبة بنجاح",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "فشل حذف الوجبة",
      });
    }
  } catch (error) {
    console.error("Error deleting meal from training table: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في حذف الوجبة",
      error: error.message,
    });
  }
}

// دالة لحذف جدول تدريبي كامل (سيحذف جميع الوجبات تلقائياً بسبب CASCADE)
async function deleteTrainingTable(req, res) {
  try {
    const { table_id } = req.body;

    // التحقق من وجود معرف الجدول
    if (!table_id) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال معرف الجدول",
      });
    }

    // حذف الجدول الرئيسي (الوجبات ستُحذف تلقائياً بسبب CASCADE)
    const result = await deleteData(
      "training_tables",
      `table_id = ${table_id}`
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "تم حذف الجدول التدريبي وجميع وجباته بنجاح",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "فشل حذف الجدول التدريبي",
      });
    }
  } catch (error) {
    console.error("Error deleting training table: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في حذف الجدول التدريبي",
      error: error.message,
    });
  }
}

module.exports = { 
  updateTrainingTable, 
  updateMealInTable, 
  deleteMealFromTable,
  deleteTrainingTable 
};
