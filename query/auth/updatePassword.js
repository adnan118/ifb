const {
    updateData
  } = require("../../controllers/functions");
 
 
  
  async function updatePassword(req, res) {
    try {
      const { users_phone, users_password } = req.body;

      // التحقق من وجود البيانات
      if (!users_password || !users_phone) {
        return res.status(400).json({
          status: "failure",
          message: "All information must be entered.",
        });
      }
    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(users_password, 10);
      const updateFields = {
        users_password: hashedPassword,
      };

      const result = await updateData(
        "users",
        updateFields,
        "users_phone = ?",
        [users_phone]
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
  module.exports = { updatePassword };
