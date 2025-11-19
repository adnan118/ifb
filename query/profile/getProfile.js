const { getData } = require("../../controllers/functions");

// دالة لجلب بيانات الملف الشخصي
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
    const userResult = await getData("users", "users_id = ?", [users_id]);
    
    if (userResult.status !== "success") {
      return res.status(500).json({
        status: "failure",
        message: "Failed to retrieve user data.",
      });
    }
    
    // استرجاع بيانات شخصية إضافية من جدول personaldataregister
    const personalDataResult = await getData("personaldataregister", "personalData_users_id = ?", [users_id]);
    
    // دمج البيانات
    const profileData = {
      ...userResult.data,
      ...(personalDataResult.status === "success" ? personalDataResult.data : {})
    };
    
    res.status(200).json({
      status: "success",
      data: profileData,
    });

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
