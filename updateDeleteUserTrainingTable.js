const { updateData, deleteData } = require("../../controllers/functions");

// دالة لتحديث تعيين جدول تدريبي لمستخدم
async function updateUserTrainingTable(req, res) {
  try {
    const { 
      user_table_id,
      is_active, 
      progress_percentage, 
      start_date, 
      end_date,
      notes_ar, 
      notes_en 
    } = req.body;

    // التحقق من وجود معرف التعيين
    if (!user_table_id) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال معرف التعيين",
      });
    }

    // تحديث البيانات في قاعدة البيانات
    const updateDataTable = {};
    
    if (is_active !== undefined) updateDataTable.is_active = is_active;
    if (progress_percentage !== undefined) updateDataTable.progress_percentage = progress_percentage;
    if (start_date !== undefined) updateDataTable.start_date = start_date;
    if (end_date !== undefined) updateDataTable.end_date = end_date;
    if (notes_ar !== undefined) updateDataTable.notes_ar = notes_ar;
    if (notes_en !== undefined) updateDataTable.notes_en = notes_en;

    const result = await updateData(
      "user_training_tables",
      updateDataTable,
      "user_table_id = ?",
      [user_table_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "تم تحديث تعيين الجدول التدريبي بنجاح",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "فشل تحديث تعيين الجدول التدريبي",
      });
    }
  } catch (error) {
    console.error("Error updating user training table: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في تحديث تعيين الجدول التدريبي",
      error: error.message,
    });
  }
}

// دالة لإلغاء تعيين جدول تدريبي لمستخدم (حذف)
async function removeUserTrainingTable(req, res) {
  try {
    const { user_table_id } = req.body;

    // التحقق من وجود معرف التعيين
    if (!user_table_id) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال معرف التعيين",
      });
    }

    // حذف التعيين من قاعدة البيانات
    const result = await deleteData(
      "user_training_tables",
      `user_table_id = ${user_table_id}`
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "تم إلغاء تعيين الجدول التدريبي بنجاح",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "فشل إلغاء تعيين الجدول التدريبي",
      });
    }
  } catch (error) {
    console.error("Error removing user training table: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في إلغاء تعيين الجدول التدريبي",
      error: error.message,
    });
  }
}

// دالة لإلغاء تنشيط خطة لمستخدم (بدلاً من الحذف)
async function deactivateUserTrainingTable(req, res) {
  try {
    const { user_table_id } = req.body;

    if (!user_table_id) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال معرف التعيين",
      });
    }

    const result = await updateData(
      "user_training_tables",
      { is_active: false },
      "user_table_id = ?",
      [user_table_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "تم إلغاء تنشيط الخطة بنجاح",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "فشل إلغاء تنشيط الخطة",
      });
    }
  } catch (error) {
    console.error("Error deactivating user training table: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في إلغاء تنشيط الخطة",
      error: error.message,
    });
  }
}

module.exports = { 
  updateUserTrainingTable, 
  removeUserTrainingTable,
  deactivateUserTrainingTable
};
