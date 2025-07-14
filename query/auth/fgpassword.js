const { updateData, getData } = require("../../controllers/functions"); 
const bcrypt = require("bcrypt");

// دالة لتوليد كود تحقق عشوائي مكون من أرقام فقط
function generateVerificationCode(length) {
  const chars = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return code;
}

async function FgPassword(req, res) {
  try {
    const { users_phone } = req.body;

    // التحقق من وجود البيانات
    if (!users_phone) {
      return res.status(400).json({
        status: "failure",
        message: "You must enter your phone.",
      });
    }

    // تحقق من وجود المستخدم
    const userResult = await getData("users", "users_phone = ?", [users_phone]);
    if (userResult.status !== "success" || !userResult.data) {
      return res.status(404).json({
        status: "failure",
        message: "Phone number not found.",
      });
    }

    // توليد كود تحقق جديد
    const verificationCode = generateVerificationCode(4);

    // تحديث كود التحقق فقط بدون تغيير كلمة المرور
    const data = {
      users_verflyCode: verificationCode
    };

    const result = await updateData("users", data, "users_phone = ?", [users_phone]);

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Password changed and verification code updated successfully.", 
      });
    } else {
      res.json({
        status: "failure",
        message: "Failed to change password.",
      });
    }
  } catch (error) {
    console.error("Error processing reset password: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem reset password",
    });
  }
}

// تصدير الدالة
module.exports = { FgPassword };
