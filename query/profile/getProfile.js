const { getData } = require("../../controllers/functions");
 
// دالة لتسجيل الدخول
async function GetProfile(req, res) {
  try {
    const { users_id } = req.body;  
    // التحقق من وجود البيانات
    if (!users_id) {
      return res.status(400).json({
        status: "failure",
        message: "User id is incorrect.",
      });
    } 

    // استرجاع بيانات المستخدم من قاعدة البيانات      
    const result = await getData("users", "users_id = ?", [users_id]);

  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem retrieving data",
    });
  }
}

// تصدير الدالة
module.exports = { GetProfile };
