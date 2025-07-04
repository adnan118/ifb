const {
    updateData,
    handleImageUpload,
    handleImageDeletion,
    getData,
  } = require("../../controllers/functions");
  const path = require("path");
  const fs = require("fs");
  const bcrypt = require("bcrypt");
  
  // دالة لرفع الصور
  const uploadImages = handleImageUpload(
    "query/auth/userImages",
    [{ name: "users_img", maxCount: 1 }]
  );
  
  // دالة لحذف الصور
  const deleteImages = handleImageDeletion(
    "query/auth/userImages/images/images", // مسار الصور
     
    "users", // اسم الجدول
    "users_id", // حقل المعرف
    "users_img" // حقل الصورة
  );
  
  async function updateUserData(req, res) {
    try {
       
  
        const user_img_file = req.files["users_img"]
  ? req.files["users_img"][0]
  : req.files["file"]
    ? req.files["file"][0]
    : null;

      const {
        users_id,
        users_name,
        users_phone,
        users_password,
      } = req.body;
  
      // استعلام للحصول على الصورة القديمة
      const oldUserData = await getData("users", "users_id = ?", [users_id]);
  
      const old_users_img =
        oldUserData &&
        oldUserData.status === "success" &&
        oldUserData.data
          ? oldUserData.data.users_img
          : null;
  
      let users_img_path = old_users_img || "img.png"; // الافتراضي
  
      if (user_img_file) {
        const newFileName = user_img_file.filename;
        // حذف الصورة القديمة دائماً إذا لم تكن الافتراضية
        if (old_users_img && old_users_img !== "img.png") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/auth/userImages/images",
            old_users_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        users_img_path = newFileName;
      }
  
      // إعدادات التحديث
      const updateFields = {};
  
      if (users_name !== undefined) {
        updateFields.users_name = users_name;
      }
  
      if (users_phone !== undefined) {
        // تحقق إذا كان الرقم الجديد مستخدم من قبل مستخدم آخر
        const checkPhone = await getData("users", "users_phone = ? AND users_id != ?", [users_phone, users_id]);
        if (checkPhone.status === "success" && checkPhone.data) {
          return res.status(400).json({
            status: "failure",
            message: "This phone number is already used by another user.",
          });
        }
        updateFields.users_phone = users_phone;
      }
  
      if (users_password !== undefined) {
        // تشفير كلمة المرور قبل الحفظ
        const hashedPassword = await bcrypt.hash(users_password, 10);
        updateFields.users_password = hashedPassword;
      }
  
      // التعامل مع الصورة، إذا تم التعديل عليها أو لا
      updateFields.users_img = users_img_path;
  
      const result = await updateData(
        "users",
        updateFields,
        "users_id = ?",
        [users_id]
      );
  
      if (result.status === "success") {
        res.json({
          status: "success",
          message: "User data updated successfully.",
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to update user data.",
        });
      }
    } catch (error) {
      console.error("Error updating user data: ", error);
      res.status(500).json({
        status: "failure",
        message: "There is a problem updating user data.",
      });
    }
  }
  
  // تصدير الدالة
  module.exports = { updateUserData , uploadImages};
