const { getAllData, updateData } = require("../../controllers/functions");
const bcrypt = require("bcrypt"); // bcrypt: مكتبة تُستخدم لتشفير كلمات المرور والتحقق منها.

// دالة لتسجيل الدخول
async function LoginUser(req, res) {
  try {
    const { users_phone, users_password } = req.body; //req.body: يحتوي على بيانات المستخدم (البريد الإلكتروني وكلمة المرور) التي تم إرسالها من العميل.

    // التحقق من وجود البيانات
    if (!users_phone || !users_password) {
      return res.status(400).json({
        status: "failure",
        message: "You must enter your phone and password.",
      });
    }
    const userDatalastLog = {
      last_log: new  Date, // تعديل اخر تسجيل دخول
    };

    // استرجاع بيانات المستخدم من قاعدة البيانات دون كلمة المرور
    const result = await getAllData("users", "users_phone = ?", [users_phone]);

    // التحقق من النتيجة
    if (result.status === "success" && result.data.length > 0) {
      const user = result.data[0]; // الحصول على المستخدم (البيانات الأولى)
      console.log(user);

      // التحقق من كلمة المرور
      const isPasswordValid = await bcrypt.compare(
        users_password,
        user.users_password
      );

      if (isPasswordValid) {
        // كلمة المرور صحيحة
        // هنا نتحقق من حالة الموافقة
        res.json({ status: "success", data: user });
        updateData(
          "users",
          userDatalastLog,
          "users_phone = ?",
          [users_phone],
          false
        );
      } else {
        // كلمة المرور غير صحيحة
        res.json({
          status: "failure",
          message: "User does not exist or password is incorrect.",
        });
      }
    } else {
      res.json({
        status: "failure",
        message: "User does not exist or phone is incorrect.",
      });
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem retrieving data",
    });
  }
}
async function LoginAdmin(req, res) {
  try {
    const { phone, users_password } = req.body; //req.body: يحتوي على بيانات المستخدم (البريد الإلكتروني وكلمة المرور) التي تم إرسالها من العميل.

    // التحقق من وجود البيانات
    if (!phone || !users_password) {
      return res.status(400).json({
        status: "failure",
        message: "You must enter your phone and password.",
      });
    }
    const userDatalastLog = {
      last_log: new Date(), // تعديل اخر تسجيل دخول
    };

    // استرجاع بيانات المستخدم من قاعدة البيانات دون كلمة المرور
    const result = await getAllData("admin", "phone = ?", [phone]);

    // التحقق من النتيجة
    if (result.status === "success" && result.data.length > 0) {
      const user = result.data[0]; // الحصول على المستخدم (البيانات الأولى)
      console.log(user);

      // التحقق من كلمة المرور
      const isPasswordValid = await bcrypt.compare(
        users_password,
        user.users_password
      );

      if (isPasswordValid) {
        // كلمة المرور صحيحة
        // هنا نتحقق من حالة الموافقة
        res.json({ status: "success", data: user });
        updateData(
          "admin",
          userDatalastLog,
          "phone = ?",
          [phone],
          false
        );
      } else {
        // كلمة المرور غير صحيحة
        res.json({
          status: "failure",
          message: "User does not exist or password is incorrect.",
        });
      }
    } else {
      res.json({
        status: "failure",
        message: "User does not exist or phone is incorrect.",
      });
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem retrieving data",
    });
  }
}


// تصدير الدالة
module.exports = { LoginUser, LoginAdmin };


