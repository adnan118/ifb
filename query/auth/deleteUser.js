const {
  deleteData,
  getData
} = require("../../controllers/functions");
const { getConnection } = require("../../controllers/db");
const mysql = require("mysql2");
const path = require("path");
const fs = require("fs");

// دالة لحذف المستخدم
async function deleteUser(req, res) {
  try {
    const { users_phone } = req.body;
    
    // التحقق من وجود رقم الهاتف
    if (!users_phone) {
      return res.status(400).json({
        status: "failure",
        message: "You must provide the user's phone number.",
      });
    }

    // الحصول على معلومات المستخدم قبل حذفه
    const userData = await getData("users", "users_phone = ?", [users_phone]);
    
    if (userData.status === "success" && userData.data) {
      // حذف صورة المستخدم إذا كانت موجودة وليست الصورة الافتراضية
      if (userData.data.users_img && userData.data.users_img !== "img.png") {
        const imagePath = path.join(
          process.cwd(),
          "query/auth/userImages/images",
          userData.data.users_img
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("تم حذف صورة المستخدم:", imagePath);
        }
      }

      // حذف المستخدم من قاعدة البيانات
      const result = await deleteData("users", "users_phone = ?", [users_phone]);

      if (result.status === "success") {
        res.json({
          status: "success",
          message: "User and associated data deleted successfully.",
          data: {
            users_phone,
            users_name: userData.data.users_name,
            users_id: userData.data.users_id,
          },
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to delete user data.",
        });
      }
    } else {
      // المستخدم غير موجود
      res.status(404).json({
        status: "failure",
        message: "User not found with the provided phone number.",
      });
    }
  } catch (error) {
    console.error("Error deleting user data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting user data",
    });
  }
}

// دالة لحذف المستخدم باستخدام ID
async function deleteUserById(req, res) {
  let connection;
  let imagePath;
  try {
    const { users_id } = req.body;
    
    // التحقق من وجود ID المستخدم
    if (!users_id) {
      return res.status(400).json({
        status: "failure",
        message: "You must provide the user's ID.",
      });
    }

    // الحصول على معلومات المستخدم قبل حذفه
    const userData = await getData("users", "users_id = ?", [users_id]);
    
    if (userData.status === "success" && userData.data) {
      // Keep the image until the database transaction succeeds.
      if (userData.data.users_img && userData.data.users_img !== "img.png") {
        imagePath = path.join(
          process.cwd(),
          "query/auth/userImages/images",
          userData.data.users_img
        );
      }

      connection = await getConnection();
      await connection.beginTransaction();

      // Delete all direct foreign-key dependants before deleting the user.
      // This keeps account deletion working when new user-owned tables are added.
      const [references] = await connection.execute(
        `SELECT TABLE_NAME, COLUMN_NAME
         FROM information_schema.KEY_COLUMN_USAGE
         WHERE REFERENCED_TABLE_SCHEMA = DATABASE()
           AND REFERENCED_TABLE_NAME = 'users'
           AND REFERENCED_COLUMN_NAME = 'users_id'`
      );

      for (const reference of references) {
        const tableName = mysql.escapeId(reference.TABLE_NAME);
        const columnName = mysql.escapeId(reference.COLUMN_NAME);
        await connection.execute(
          `DELETE FROM ${tableName} WHERE ${columnName} = ?`,
          [users_id]
        );
      }

      const [result] = await connection.execute(
        "DELETE FROM users WHERE users_id = ?",
        [users_id]
      );

      if (result.affectedRows === 1) {
        await connection.commit();
        try {
          if (imagePath && fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log("تم حذف صورة المستخدم:", imagePath);
          }
        } catch (imageError) {
          console.error("Could not delete user image:", imageError);
        }
        res.json({
          status: "success",
          message: "User and associated data deleted successfully.",
          data: {
            users_id,
            users_name: userData.data.users_name,
            users_phone: userData.data.users_phone,
          },
        });
      } else {
        await connection.rollback();
        res.status(500).json({
          status: "failure",
          message: "Failed to delete user data.",
        });
      }
    } else {
      // المستخدم غير موجود
      res.status(404).json({
        status: "failure",
        message: "User not found with the provided ID.",
      });
    }
  } catch (error) {
    if (connection) {
      try { await connection.rollback(); } catch (_) {}
    }
    console.error("Error deleting user data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting user data",
    });
  } finally {
    if (connection) {
      try { await connection.end(); } catch (_) {}
    }
  }
}

module.exports = { deleteUser, deleteUserById };
