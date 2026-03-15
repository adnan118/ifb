const { insertData, getData } = require("../../controllers/functions");

// دالة لتعيين جدول تدريبي لمستخدم
async function assignTrainingTableToUser(req, res) {
  try {
    const { 
      user_id, 
      table_id, 
      start_date, 
      end_date, 
      is_active, 
      notes_ar, 
      notes_en 
    } = req.body;

    // التحقق من الحقول المطلوبة
    if (!user_id || !table_id) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال معرف المستخدم ومعرف الجدول",
      });
    }

    // التحقق من وجود المستخدم
    const userExists = await getData(
      "personaldataregister", 
      "personalData_users_id = ?", 
      [user_id]
    );
    
    if (!userExists || !userExists.data) {
      return res.status(404).json({
        status: "failure",
        message: "المستخدم غير موجود",
      });
    }

    // التحقق من وجود الجدول التدريبي
    const tableExists = await getData(
      "training_tables", 
      "table_id = ?", 
      [table_id]
    );
    
    if (!tableExists || !tableExists.data) {
      return res.status(404).json({
        status: "failure",
        message: "الجدول التدريبي غير موجود",
      });
    }

    // إدخال البيانات في قاعدة البيانات
    const insertDataUserTable = {
      user_id: user_id,
      table_id: table_id,
      start_date: start_date || null,
      end_date: end_date || null,
      is_active: is_active !== undefined ? is_active : true,
      notes_ar: notes_ar || null,
      notes_en: notes_en || null,
    };

    const result = await insertData("user_training_tables", insertDataUserTable);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "تم تعيين الجدول التدريبي للمستخدم بنجاح",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "فشل تعيين الجدول التدريبي للمستخدم",
      });
    }
  } catch (error) {
    console.error("Error assigning training table to user: ", error);
    
    // التعامل مع خطأ التكرار الفريد
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      return res.status(409).json({
        status: "failure",
        message: "هذا المستخدم لديه بالفعل هذه الخطة نشطة",
      });
    }
    
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في تعيين الجدول التدريبي للمستخدم",
      error: error.message,
    });
  }
}

module.exports = { assignTrainingTableToUser };
