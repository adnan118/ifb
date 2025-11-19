const {
  deleteData,
  getData,
  updateData
} = require("../../../controllers/functions");

// دالة لحذف البيانات الشخصية للمستخدم
async function deletePersonalData(req, res) {
  try {
    const { personalData_users_id } = req.body;
    
    // التحقق من وجود معرف المستخدم
    if (!personalData_users_id) {
      return res.status(400).json({
        status: "failure",
        message: "You must provide the user's ID.",
      });
    }

    // الحصول على البيانات الشخصية قبل حذفها
    const personalDataResult = await getData(
      "personaldataregister", 
      "personalData_users_id = ?", 
      [personalData_users_id]
    );
    
    if (personalDataResult.status === "success" && personalDataResult.data) {
      // حذف البيانات الشخصية من الجدول الرئيسي
      const deleteResult = await deleteData(
        "personaldataregister", 
        "personalData_users_id = ?", 
        [personalData_users_id]
      );

      if (deleteResult.status === "success") {
        // حذف بيانات تتبع الوزن المرتبطة بالمستخدم
        await deleteData(
          "trakingweight", 
          "trakingWeight_user_id = ?", 
          [personalData_users_id]
        );

        // تحديث حالة المستخدم في جدول المستخدمين
        const updateUserData = {
          users_haveoldaccount: 0,
          users_name: null,
        };
        
        await updateData(
          "users", 
          updateUserData, 
          "users_id = ?", 
          [personalData_users_id]
        );

        res.json({
          status: "success",
          message: "Personal data deleted successfully.",
          data: {
            personalData_users_id,
            personalData_username: personalDataResult.data.personalData_username,
            deleted_records: {
              personal_data: true,
              tracking_weight: true,
              user_status_updated: true
            }
          },
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to delete personal data.",
        });
      }
    } else {
      // البيانات الشخصية غير موجودة
      res.status(404).json({
        status: "failure",
        message: "Personal data not found for the provided user ID.",
      });
    }
  } catch (error) {
    console.error("Error deleting personal data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting personal data",
    });
  }
}

module.exports = { deletePersonalData };
