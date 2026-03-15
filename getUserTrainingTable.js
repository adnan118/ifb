const { getAllData, getData } = require("../../controllers/functions");
const mysql = require("mysql2/promise");
const { getConnection } = require("../../controllers/db");

// دالة جلب الجداول التدريبية المخصصة لمستخدم معين
async function getUserTrainingTables(req, res) {
  try {
    const { user_id, include_inactive } = req.body;

    if (!user_id) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال معرف المستخدم",
      });
    }

    const connection = await getConnection();
    
    // بناء الاستعلام مع أو بدون الخطط غير النشطة
    let whereClause = "utt.user_id = ?";
    let values = [user_id];
    
    if (!include_inactive) {
      whereClause += " AND utt.is_active = TRUE";
    }
    
    const sql = `
      SELECT 
        utt.user_table_id,
        utt.user_id,
        utt.table_id,
        utt.assigned_date,
        utt.start_date,
        utt.end_date,
        utt.is_active,
        utt.progress_percentage,
        utt.notes_ar as user_notes_ar,
        utt.notes_en as user_notes_en,
        tt.name_ar as table_name_ar,
        tt.name_en as table_name_en,
        tt.description_ar,
        tt.description_en
      FROM user_training_tables utt
      JOIN training_tables tt ON utt.table_id = tt.table_id
      WHERE ${whereClause}
      ORDER BY utt.assigned_date DESC
    `;
    
    const [results] = await connection.execute(sql, values);
    await connection.end();

    if (results.length > 0) {
      res.json({
        status: "success",
        message: "تم جلب الجداول التدريبية للمستخدم بنجاح",
        data: results,
      });
    } else {
      res.json({
        status: "success",
        message: "لا توجد جداول تدريبية مخصصة لهذا المستخدم",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error fetching user training tables: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في جلب الجداول التدريبية",
      error: error.message,
    });
  }
}

// دالة جلب جميع المستخدمين الذين لديهم جداول تدريبية
async function getAllUserTrainingTables(req, res) {
  try {
    const { include_inactive } = req.body;
    
    const connection = await getConnection();
    
    let whereClause = "";
    if (!include_inactive) {
      whereClause = "WHERE utt.is_active = TRUE";
    }
    
    const sql = `
      SELECT 
        utt.user_table_id,
        utt.user_id,
        utt.table_id,
        utt.assigned_date,
        utt.start_date,
        utt.end_date,
        utt.is_active,
        utt.progress_percentage,
        tt.name_ar as table_name_ar,
        tt.name_en as table_name_en,
        CONCAT(u.userName, ' ', u.userFamily) as user_name
      FROM user_training_tables utt
      JOIN training_tables tt ON utt.table_id = tt.table_id
      LEFT JOIN users u ON utt.user_id = u.personalData_users_id
      ${whereClause}
      ORDER BY utt.user_id, utt.assigned_date DESC
    `;
    
    const [results] = await connection.execute(sql);
    await connection.end();

    if (results.length > 0) {
      res.json({
        status: "success",
        message: "تم جلب جميع تعيينات الجداول التدريبية",
        data: results,
      });
    } else {
      res.json({
        status: "success",
        message: "لا توجد تعيينات جداول تدريبية",
        data: [],
      });
    }
  } catch (error) {
    console.error("Error fetching all user training tables: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في جلب البيانات",
      error: error.message,
    });
  }
}

// دالة جلب وجبات جدول تدريبي مخصص لمستخدم
async function getUserTableMeals(req, res) {
  try {
    const { user_id, table_id } = req.body;

    if (!user_id || !table_id) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال معرف المستخدم ومعرف الجدول",
      });
    }

    const connection = await getConnection();
    
    const sql = `
      SELECT 
        tm.*,
        tt.name_ar as table_name_ar,
        tt.name_en as table_name_en,
        utt.is_active,
        utt.progress_percentage
      FROM training_table_meals tm
      JOIN training_tables tt ON tm.table_id = tt.table_id
      JOIN user_training_tables utt ON tt.table_id = utt.table_id
      WHERE utt.user_id = ? AND tm.table_id = ?
      ORDER BY 
        CASE tm.period_ar
          WHEN 'فطور' THEN 1
          WHEN 'سناك' THEN 2
          WHEN 'غداء' THEN 3
          WHEN 'عشاء' THEN 4
          ELSE 5
        END
    `;
    
    const [results] = await connection.execute(sql, [user_id, table_id]);
    await connection.end();

    if (results.length > 0) {
      res.json({
        status: "success",
        message: "تم جلب وجبات الجدول التدريبي المخصص بنجاح",
        data: results,
      });
    } else {
      res.status(404).json({
        status: "failure",
        message: "لا توجد وجبات لهذا الجدول أو هذا المستخدم",
      });
    }
  } catch (error) {
    console.error("Error fetching user table meals: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في جلب الوجبات",
      error: error.message,
    });
  }
}

module.exports = { 
  getUserTrainingTables, 
  getAllUserTrainingTables,
  getUserTableMeals 
};
