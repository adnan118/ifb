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
      const authenticatedUserId = Number(req.authUser?.id);
      const requestedUserId = Number(req.body?.users_id);
      if (!Number.isInteger(authenticatedUserId) || authenticatedUserId <= 0) {
        return res.status(401).json({
          status: "failure",
          message: "Authentication is required.",
        });
      }
      if (!Number.isInteger(requestedUserId) || requestedUserId !== authenticatedUserId) {
        return res.status(403).json({
          status: "failure",
          message: "You can update only your own profile.",
        });
      }

      const uploadedFiles = req.files || {};
      const user_img_file = uploadedFiles["users_img"]
        ? uploadedFiles["users_img"][0]
        : uploadedFiles["file"]
          ? uploadedFiles["file"][0]
          : null;

      const {
        users_name,
        users_phone,
        users_password,
      } = req.body;
  
      // استعلام للحصول على الصورة القديمة
      const oldUserData = await getData("users", "users_id = ?", [requestedUserId]);
  
      const old_users_img =
        oldUserData &&
        oldUserData.status === "success" &&
        oldUserData.data
          ? oldUserData.data.users_img
          : null;
  
      let users_img_path = old_users_img || "img.png"; // الافتراضي
  
      if (user_img_file) {
        users_img_path = user_img_file.filename;
      }
  
      // إعدادات التحديث
      const updateFields = {};
  
      if (typeof users_name === "string" && users_name.trim()) {
        updateFields.users_name = users_name.trim();
      }
  
      if (users_phone !== undefined) {
        // تحقق إذا كان الرقم الجديد مستخدم من قبل مستخدم آخر
        const checkPhone = await getData("users", "users_phone = ? AND users_id != ?", [users_phone, requestedUserId]);
        if (checkPhone.status === "success" && checkPhone.data) {
          return res.status(400).json({
            status: "failure",
            message: "This phone number is already used by another user.",
          });
        }
        updateFields.users_phone = users_phone;
      }
  
      if (typeof users_password === "string" && users_password.trim()) {
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
        [requestedUserId]
      );
  
      if (result.status === "success") {
        // Delete the previous image only after the database update succeeds.
        if (user_img_file && old_users_img && old_users_img !== "img.png") {
          const oldImagePath = path.join(
            process.cwd(),
            "query/auth/userImages/images",
            old_users_img
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        res.json({
          status: "success",
          message: "User data updated successfully.",
          data: {
            users_id: requestedUserId,
            users_name: updateFields.users_name ?? oldUserData.data.users_name,
            users_phone: updateFields.users_phone ?? oldUserData.data.users_phone,
            users_img: users_img_path,
          },
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
