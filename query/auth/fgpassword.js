const { updateData } = require("../../controllers/functions"); 
 const bcrypt = require("bcrypt");
async function FgPassword(req, res) {
  try {
    const { users_phone, users_password } = req.body; // الحصول على الهاتف وكود التحقق من الجسم

    // التحقق من وجود البيانات
    if (!users_phone || !users_password) {
      return res.status(400).json({
        status: "failure",
        message: "You must enter your phone and password .",
      });
    }

    
  
        const hashedPassword = await bcrypt.hash(users_password, 10);

        const data = {
          users_password: hashedPassword, 
        };

        // تحديث كود التحقق في قاعدة البيانات
        const result = await updateData("users", data, "users_phone = ?", [
          users_phone,
        ]);

        if (result.status === "success") {
           
          res.json({
            status: "success",
            message: "changed password successfully",
          });
        } else {
          res.json({
            status: "failure",
            message: "Failed changed password.",
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
