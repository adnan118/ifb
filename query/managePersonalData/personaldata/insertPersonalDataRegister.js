const { insertData, updateData } = require("../../../controllers/functions");
 
// دالة لادخال بيانات التسجيل  
async function insertPersonalDataRegister(req, res) {
  try {
    const {
      personalData_users_id,
      personalData_gender_id,
      personalData_goal_id,
      personalData_specialPrograms_id,
      personalData_activities_id,
      personalData_bodyType_id,
      personalData_username,
      personalData_birthdate,
      personalData_height,
      personalData_currentWeight,
      personalData_goalWeight,
      personalData_typicalDay_id,
      personalData_energyLevels_id,
      personalData_physicallyActive_id,
      personalData_lastIdealWeight_id,
      personalData_areasAttention_id,
      personalData_restNight_id,
      personalData_dietType_id,
      personalData_badHabits_id,
      personalData_dailyWater_id,
      personalData_BMI,
      personalData_specialEvent_id,
      personalData_specialEvent_date,
      personalData_offers_id,
      personalData_expOffer,
      personalData_isPaidOffer,
     } = req.body;

    // إدخال البيانات في قاعدة البيانات
    const insertUserData = {
      personalData_users_id: personalData_users_id,
      personalData_gender_id: personalData_gender_id,
      personalData_goal_id: personalData_goal_id,
      personalData_specialPrograms_id: personalData_specialPrograms_id,
      personalData_bodyType_id: personalData_bodyType_id,
      personalData_activities_id: personalData_activities_id,
      personalData_username: personalData_username,
      personalData_birthdate: personalData_birthdate,
      personalData_height: personalData_height,
      personalData_currentWeight: personalData_currentWeight,
      personalData_goalWeight: personalData_goalWeight,
      personalData_typicalDay_id: personalData_typicalDay_id,
      personalData_energyLevels_id: personalData_energyLevels_id,
      personalData_physicallyActive_id: personalData_physicallyActive_id,
      personalData_lastIdealWeight_id: personalData_lastIdealWeight_id,
      personalData_areasAttention_id: personalData_areasAttention_id,
      personalData_restNight_id: personalData_restNight_id,
      personalData_dietType_id: personalData_dietType_id,
      personalData_badHabits_id: personalData_badHabits_id,
      personalData_dailyWater_id: personalData_dailyWater_id,
      personalData_BMI: personalData_BMI,
      personalData_specialEvent_id: personalData_specialEvent_id,
      personalData_specialEvent_date:personalData_specialEvent_date,
      personalData_offers_id: personalData_offers_id,
      personalData_expOffer: personalData_expOffer,
      personalData_isPaidOffer: personalData_isPaidOffer,
     };

    
        //تعديل على جدول المستخدمين // الاسم و حالة الحساب
    const updateUserData = {
      users_haveoldaccount: 1,
      users_name: personalData_username,
    };
    const result = await insertData("personaldataregister", insertUserData);


    
    if (result.status === "success") {
      // إدراج الوزن في جدول تتبع الوزن
      const now = new Date();
      const currentTimestamp = now.toISOString();
      await insertData("trakingweight", {
        trakingWeight_user_id: personalData_users_id,
        trakingWeight_pre: personalData_currentWeight,
        trakingWeight_current: personalData_currentWeight,
        trakingWeight_target: personalData_goalWeight,
        trakingWeight_lastedit: currentTimestamp
      });

      res.json({
        status: "success",
        message: "Insert data successfully.",
      });
    
      updateData("users", updateUserData, "users_id = ?", [
        personalData_users_id,
      ]);



    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to insert data.",
      });
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem inserting data",
    });
  }
}
// تصدير الدالة
module.exports = { insertPersonalDataRegister };
