const { getAllData, getData } = require("../../controllers/functions");

// دالة جلب جميع الجداول التدريبية الجاهزة
async function getDataReadyTables(req, res) {
  try {
    const { ready_table_id, period_ar, period_en } = req.body;

    // إذا تم إرسال معرف الجدول، نجلب البيانات المحددة
    if (ready_table_id) {
      const result = await getData(
        "ready_training_tables",
        "ready_table_id = ?",
        [ready_table_id]
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
    // إذا تم إرسال الفترة (عربي أو إنجليزي)، نجلب البيانات حسب الفترة
    else if (period_ar || period_en) {
      let whereClause = "";
      let values = [];
      
      if (period_ar) {
        whereClause = "period_ar = ?";
        values = [period_ar];
      } else if (period_en) {
        whereClause = "period_en = ?";
        values = [period_en];
      }
      
      const result = await getData(
        "ready_training_tables",
        whereClause,
        values
      );

      if (result.status === "success") {
        const periodValue = period_ar || period_en;
        res.json({
          status: "success",
          message: `تم جلب جداول الفترة: ${periodValue}`,
          data: result.data,
        });
      } else {
        res.status(404).json({
          status: "failure",
          message: "لا توجد جداول لهذه الفترة",
        });
      }
    }
    // إذا لم يتم إرسال أي معلمات، نجلب جميع الجداول
    else {
      const result = await getAllData("ready_training_tables");

      if (result.status === "success") {
        res.json({
          status: "success",
          message: "تم جلب جميع الجداول التدريبية الجاهزة",
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
    console.error("Error fetching ready training tables: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في جلب الجداول التدريبية الجاهزة",
      error: error.message,
    });
  }
}

// تصدير الدالة
module.exports = { getDataReadyTables };
