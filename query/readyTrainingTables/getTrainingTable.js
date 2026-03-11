const { getAllData, getData } = require("../../controllers/functions");
const mysql = require("mysql2/promise");
const { getConnection } = require("../../controllers/db");

// دالة جلب جميع الجداول التدريبية
async function getTrainingTables(req, res) {
  try {
    const { table_id } = req.body;

    // إذا تم إرسال معرف الجدول، نجلب البيانات المحددة
    if (table_id) {
      const result = await getData(
        "training_tables",
        "table_id = ?",
        [table_id]
      );

      if (result.status === "success" && result.data) {
        res.json({
          status: "success",
          message: "تم جلب بيانات الجدول بنجاح",
          data: result.data,
        });
      } else {
        res.status(404).json({
          status: "failure",
          message: "الجدول غير موجود",
        });
      }
    } 
    // إذا لم يتم إرسال أي معلمات، نجلب جميع الجداول
    else {
      const result = await getAllData("training_tables");

      if (result.status === "success") {
        res.json({
          status: "success",
          message: "تم جلب جميع الجداول التدريبية",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "فشل جلب البيانات",
        });
      }
    }
  } catch (error) {
    console.error("Error fetching training tables: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في جلب الجداول التدريبية",
      error: error.message,
    });
  }
}

// دالة جلب وجبات جدول تدريبي محدد
async function getMealsByTableId(req, res) {
  try {
    const { table_id } = req.body;

    if (!table_id) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال معرف الجدول",
      });
    }

    // استخدام اتصال MySQL المباشر للحصول على JOIN
    const connection = await getConnection();
    
    const sql = `
      SELECT tm.*, tt.name_ar as table_name_ar, tt.name_en as table_name_en
      FROM training_table_meals tm
      JOIN training_tables tt ON tm.table_id = tt.table_id
      WHERE tm.table_id = ?
      ORDER BY 
        CASE tm.period_ar
          WHEN 'فطور' THEN 1
          WHEN 'سناك' THEN 2
          WHEN 'غداء' THEN 3
          WHEN 'عشاء' THEN 4
          ELSE 5
        END
    `;
    
    const [results] = await connection.execute(sql, [table_id]);
    await connection.end();

    if (results.length > 0) {
      res.json({
        status: "success",
        message: "تم جلب وجبات الجدول التدريبي بنجاح",
        data: results,
      });
    } else {
      res.status(404).json({
        status: "failure",
        message: "لا توجد وجبات لهذا الجدول",
      });
    }
  } catch (error) {
    console.error("Error fetching meals by table ID: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في جلب وجبات الجدول",
      error: error.message,
    });
  }
}

// دالة جلب جميع الوجبات مع معلومات الجداول
async function getAllMealsWithTables(req, res) {
  try {
    const connection = await getConnection();
    
    const sql = `
      SELECT 
        tm.meal_id,
        tm.table_id,
        tm.period_ar,
        tm.period_en,
        tm.meal_name_ar,
        tm.meal_name_en,
        tm.notes_ar,
        tm.notes_en,
        tt.name_ar as table_name_ar,
        tt.name_en as table_name_en,
        tt.description_ar,
        tt.description_en
      FROM training_table_meals tm
      JOIN training_tables tt ON tm.table_id = tt.table_id
      ORDER BY tt.table_id, tm.meal_id
    `;
    
    const [results] = await connection.execute(sql);
    await connection.end();

    if (results.length > 0) {
      res.json({
        status: "success",
        message: "تم جلب جميع الوجبات بنجاح",
        data: results,
      });
    } else {
      res.status(404).json({
        status: "failure",
        message: "لا توجد وجبات",
      });
    }
  } catch (error) {
    console.error("Error fetching all meals with tables: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في جلب الوجبات",
      error: error.message,
    });
  }
}

module.exports = { getTrainingTables, getMealsByTableId, getAllMealsWithTables };
