const { getAllData } = require("../../controllers/functions");
// START ADDED: sanitize returned user objects
const { sanitizeUser } = require("../../controllers/authToken");
// END ADDED: sanitize returned user objects

const allowedFields = [
  "users_id",
  "users_name",
  "users_phone",
  "users_password",
];

async function getUserData(req, res) {
  try {
    let { field, value } = req.body;

    if (!field || !value || !allowedFields.includes(field)) {
      return res.status(400).json({
        status: "failure",
        message: "حقل البحث غير صحيح أو غير موجود",
      });
    }

    value = String(value).trim();

    let condition;
    let searchValue;

    if (field === "users_id") {
      condition = `${field} = ?`;
      searchValue = value;
    } else {
      condition = `LOWER(${field}) LIKE LOWER(?)`;
      searchValue = `%${value}%`;
    }

    const result = await getAllData("users", condition, [searchValue]);

    if (result.status === "success" && result.data.length > 0) {
      // START ADDED: remove password fields from returned users
      res.status(200).json({
        status: "success",
        data: result.data.map((user) => sanitizeUser(user)),
      });
      // END ADDED: remove password fields from returned users
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

async function getAllUsers(req, res) {
  try {
    const result = await getAllData("users");

    if (result.status === "success" && result.data.length > 0) {
      // START ADDED: remove password fields from returned users
      res.status(200).json({
        status: "success",
        data: result.data.map((user) => sanitizeUser(user)),
      });
      // END ADDED: remove password fields from returned users
    } else {
      res.status(404).json({
        status: "failure",
        message: "لا يوجد مستخدمون",
      });
    }
  } catch (error) {
    console.error("Error in getAllUsers: ", error);
    res.status(500).json({
      status: "failure",
      message: "هناك خطأ في جلب المستخدمين",
    });
  }
}

module.exports = { getUserData, getAllUsers };


/*const { getAllData } = require("../../controllers/functions");

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

    // بناء شرط البحث
    let condition;
    let searchValue;

    if (field === "users_id") {
      condition = `${field} = ?`;
      searchValue = value; // بدون علامات النمط
    } else {
      condition = `LOWER(${field}) LIKE LOWER(?)`;
      searchValue = `%${value}%`;
    }

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

// دالة لإرجاع جميع المستخدمين
async function getAllUsers(req, res) {
  try {
    const result = await getAllData("users");
    if (result.status === "success" && result.data.length > 0) {
      res.status(200).json({
        status: "success",
        data: result.data,
      });
    } else {
      res.status(404).json({
        status: "failure",
        message: "لا يوجد مستخدمون",
      });
    }
  } catch (error) {
    console.error("Error in getAllUsers: ", error);
    res.status(500).json({
      status: "failure",
      message: "هناك خطأ في جلب المستخدمين",
    });
  }
}

// تصدير الدالة
module.exports = { getUserData, getAllUsers };
*/
