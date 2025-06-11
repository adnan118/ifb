const {
  getAllData,
  insertData,
 // sentMail,
} = require("../../controllers/functions");
const bcrypt = require("bcrypt");

// دالة لتوليد كود تحقق عشوائي مكون من أحرف وأرقام
function generateVerificationCode(length) {
  const chars =
    "0123456789"; // الحروف والأرقام الممكنة
  let code = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex]; // إضافة حرف أو رقم عشوائي إلى الكود
  }

  return code;
}
   
// دالة لتسجيل مستخدم جديد
async function RegisterUser(req, res) {
  try {
    const { users_password, users_phone } = req.body;

   
    // التحقق من وجود البيانات
    if (!users_password || !users_phone) {
      return res.status(400).json({
        status: "failure",
        message: "All information must be entered.",
      });
    }

    // التحقق من وجود المستخدم مسبقًا
    const checkUser = await getAllData(
      "users",
      "users_phone = ?",
      [users_phone]
    );

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(users_password, 10);

    // توليد كود تحقق عشوائي مكون من أرقام
    const verificationCode = generateVerificationCode(4); // يمكن تغيير الطول حسب الحاجة

    // إدخال البيانات في قاعدة البيانات
    const userData = {
      users_password: hashedPassword,
      users_phone: users_phone,
      users_img: "logo.png",
      users_name: "user",
      users_verflyCode: verificationCode, // إضافة كود التحقق هنا
    };

    if (checkUser.status === "success" && checkUser.data.length > 0) {
      // إرسال  رمز التحقق هنا
      
      return res.status(400).json({
        status: "failure",
        message: "User already exists with this phone.",
      });
    } else {
      const result = await insertData("users", userData);

      if (result.status === "success") {
        res.json({
          status: "success",
          message: "User registered successfully.",
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to register user.",
        });
      }
    }
  } catch (error) {
    console.error("Error registering user: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem registering the user.",
    });
  }
}

// تصدير الدالة
module.exports = { RegisterUser };
