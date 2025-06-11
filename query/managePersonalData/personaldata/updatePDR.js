 const { getData, updateData } = require("../../../controllers/functions");  

async function updatePDR(req, res) {
  try {
    const {
      personalData_users_id,
      personalData_username,
      personalData_birthdate,
      personalData_height,
      personalData_currentWeight,
      personalData_goalWeight,
      personalData_activities_id,
      personalData_specialPrograms_id,
    } = req.body;

    // جلب البيانات الحالية
    const currentDataResult = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [personalData_users_id],
       true
    );

    if (currentDataResult.status !== "success" || currentDataResult.data.length === 0) {
    
      return res.status(404).json({ status: "failure", message: "User not found" });
    }

    const currentData = currentDataResult.data;
    

    // تحديث القيم فقط إذا كانت غير null
    const updatedUserData = {};

    // فقط القيم غير null
    if (personalData_username.length > 0) {
      updatedUserData.personalData_username = personalData_username;
      updateData(
        "users",
        { users_name: personalData_username },
        "users_id = ?",
        [personalData_users_id]
      );
    }
    else
      updatedUserData.personalData_username = currentData.personalData_username;

     
    
    
    if (personalData_birthdate != '')
      updatedUserData.personalData_birthdate = personalData_birthdate;
    else
      updatedUserData.personalData_birthdate =
        currentData.personalData_birthdate;

    if (personalData_height != '')
      updatedUserData.personalData_height = personalData_height;
    else updatedUserData.personalData_height = currentData.personalData_height;

    if (personalData_currentWeight != '')
      updatedUserData.personalData_currentWeight = personalData_currentWeight;
    else
      updatedUserData.personalData_currentWeight =
        currentData.personalData_currentWeight;

    if (personalData_goalWeight != '')
      updatedUserData.personalData_goalWeight = personalData_goalWeight;
    else
      updatedUserData.personalData_goalWeight =
        currentData.personalData_goalWeight;

    if (personalData_activities_id != '')
      updatedUserData.personalData_activities_id = personalData_activities_id;
    else
      updatedUserData.personalData_activities_id =
        currentData.personalData_activities_id;

    if (personalData_specialPrograms_id != '') 
      updatedUserData.personalData_specialPrograms_id =
        personalData_specialPrograms_id;
    else  
    updatedUserData.personalData_specialPrograms_id =
      currentData.personalData_specialPrograms_id;

    // تنفيذ عملية التحديث
    const result = await updateData(
      "personaldataregister",
      updatedUserData,
      "personalData_users_id = ?",
      [personalData_users_id]
    );

    if (result.status === "success") {
      res.json({
        status: "success",
        message: "Update data successfully.",
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to update data.",
      });
    }
  } catch (error) {
   
    console.error("Error updating data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating data",
    });
  }
}

module.exports = { updatePDR };