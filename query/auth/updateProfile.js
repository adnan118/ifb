const { updateData, getData, handleImageUpload } = require("../../controllers/functions");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

// إعداد ميدلوير رفع الصورة
const uploadUserImage = handleImageUpload(
  "query/auth/userImages/images",
  [{ name: "users_img", maxCount: 1 }]
);

// دالة لتحديث بيانات المستخدم
async function updateUserProfile(req, res) {
  try {
    const { users_id, users_name, users_phone, users_password } = req.body;
    // تحقق من وجود معرف المستخدم
    if (!users_id) {
      return res.status(400).json({
        status: "failure",
        message: "users_id is required."
      });
    }

    // جلب بيانات المستخدم القديمة
    const oldUserDataResult = await getData("users", "users_id = ?", [users_id]);
    if (oldUserDataResult.status !== "success") {
      return res.status(404).json({
        status: "failure",
        message: "User not found."
      });
    }
    const oldUser = oldUserDataResult.data;
    let users_img = oldUser.users_img || "img.png";

    // معالجة الصورة الجديدة إذا تم رفعها
    const user_img_file = req.files && req.files["users_img"] ? req.files["users_img"][0] : null;
    if (user_img_file) {
      const newFileName = user_img_file.filename;
      // حذف الصورة القديمة إذا كانت ليست الافتراضية
      if (users_img && users_img !== "img.png" && newFileName !== users_img) {
        const oldImagePath = path.join(process.cwd(), "query/auth/userImages/images", users_img);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      users_img = newFileName;
    }

    // تجهيز البيانات للتحديث
    const updateFields = {};
    if (users_name) updateFields.users_name = users_name;
    if (users_phone) updateFields.users_phone = users_phone;
    if (typeof users_img !== "undefined") updateFields.users_img = users_img;
    if (users_password) {
      // تشفير كلمة المرور
      const hashedPassword = await bcrypt.hash(users_password, 10);
      updateFields.users_password = hashedPassword;
    }

    // إذا لم يتم إرسال أي بيانات للتحديث
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        status: "failure",
        message: "No data to update."
      });
    }

    // تنفيذ التحديث
    const result = await updateData("users", updateFields, "users_id = ?", [users_id]);
    if (result.status === "success") {
      res.json({
        status: "success",
        message: "User profile updated successfully."
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update user profile."
      });
    }
  } catch (error) {
    console.error("Error updating user profile: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating user profile."
    });
  }
}

module.exports = { updateUserProfile, uploadUserImage }; 
