const { getAllData } = require("../../controllers/functions");

const allowedFields = [
  "users_id",
  "users_name",
  "users_phone",
  "users_password",
];

async function getUserData(req, res) {
  try {
    let { field, value } = req.body;

    // التحقق من أن الحقل مسموح
    if (!field || !value || !allowedFields.includes(field)) {
      return res.status(400).json({
        status: "failure",
        message: "حقل البحث غير صحيح أو غير موجود",
      });
    }

    // إزالة الفراغات من البداية والنهاية
    value = value.trim();

    // بناء شرط البحث باستخدام LIKE مع تجاهل الحالة
    const condition = `LOWER(${field}) LIKE LOWER(?)`;

    // قيمة البحث مع علامات النمط "%"
    const searchValue = `%${value}%`;

    const result = await getAllData("users", condition, [searchValue]);

    if (result.status === "success" && result.data.length > 0) {
      res.status(200).json({
        status: "success",
        data: result.data,
      });
    } else {
      res.status(404).json({
        status: "failure",
        message: "فشل في جلب البيانات",
      });
    }
  } catch (error) {
    console.error("Error in searchUser: ", error);
    res.status(500).json({
      status: "failure",
      message: "هناك خطأ في عملية البحث",
    });
  }
}

// تصدير الدالة
module.exports = { getUserData };
