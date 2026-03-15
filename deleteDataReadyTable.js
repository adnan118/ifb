const { deleteData } = require("../../controllers/functions");

// دالة لحذف جدول تدريبي جاهز
async function deleteDataReadyTable(req, res) {
  try {
    const { ready_table_id } = req.body;

    // التحقق من وجود معرف الجدول
    if (!ready_table_id) {
      return res.status(400).json({
        status: "failure",
        message: "الرجاء إدخال معرف الجدول",
      });
    }

    // حذف البيانات من قاعدة البيانات
    const result = await deleteData(
      "ready_training_tables",
      `ready_table_id = ${ready_table_id}`
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "تم حذف الجدول التدريبي الجاهز بنجاح",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "فشل حذف الجدول التدريبي الجاهز",
      });
    }
  } catch (error) {
    console.error("Error deleting ready training table data: ", error);
    res.status(500).json({
      status: "failure",
      message: "حدث خطأ في حذف الجدول التدريبي الجاهز",
      error: error.message,
    });
  }
}

// تصدير الدالة
module.exports = { deleteDataReadyTable };
