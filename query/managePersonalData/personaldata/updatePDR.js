

const { getData, updateData } = require("../../../controllers/functions");
const {
  normalizeToIdArray,
  isProvided,
  firstOrFallback,
  ensureMultiSelectTables,
  syncSimplePivot,
  syncSpecialEventsPivot,
  getConnection,
} = require("./personalDataMultiSelect");

async function updatePDR(req, res) {
  let connection;
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
      personalData_offers_id,
      personalData_dietType_id,
      personalData_areasAttention_id,
      personalData_badHabits_id,
      personalData_specialEvent_id,
      personalData_specialEvent_date,
    } = req.body;

    const currentDataResult = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [personalData_users_id],
      true
    );

    if (currentDataResult.status !== "success" || !currentDataResult.data) {
      return res.status(404).json({ status: "failure", message: "User not found" });
    }

    const currentData = currentDataResult.data;
    const updatedUserData = {};

    if (personalData_username && personalData_username.length > 0) {
      updatedUserData.personalData_username = personalData_username;
      updateData("users", { users_name: personalData_username }, "users_id = ?", [personalData_users_id]);
    } else {
      updatedUserData.personalData_username = currentData.personalData_username;
    }

    updatedUserData.personalData_birthdate =
      personalData_birthdate !== "" ? personalData_birthdate : currentData.personalData_birthdate;
    updatedUserData.personalData_height =
      personalData_height !== "" ? personalData_height : currentData.personalData_height;
    updatedUserData.personalData_currentWeight =
      personalData_currentWeight !== "" ? personalData_currentWeight : currentData.personalData_currentWeight;
    updatedUserData.personalData_goalWeight =
      personalData_goalWeight !== "" ? personalData_goalWeight : currentData.personalData_goalWeight;
    updatedUserData.personalData_activities_id =
      personalData_activities_id !== "" ? personalData_activities_id : currentData.personalData_activities_id;
    updatedUserData.personalData_offers_id =
      typeof personalData_offers_id !== "undefined" && personalData_offers_id !== ""
        ? personalData_offers_id
        : currentData.personalData_offers_id;
    updatedUserData.personalData_dietType_id =
      personalData_dietType_id !== "" &&
      personalData_dietType_id !== null &&
      personalData_dietType_id !== undefined &&
      personalData_dietType_id !== "null"
        ? personalData_dietType_id
        : currentData.personalData_dietType_id;

    // Multi-select fields: keep compatibility by storing first id in the base table.
    const specialProgramsIds = normalizeToIdArray(personalData_specialPrograms_id);
    const areasAttentionIds = normalizeToIdArray(personalData_areasAttention_id);
    const badHabitsIds = normalizeToIdArray(personalData_badHabits_id);
    const specialEventIds = normalizeToIdArray(personalData_specialEvent_id);

    updatedUserData.personalData_specialPrograms_id = isProvided(personalData_specialPrograms_id)
      ? firstOrFallback(specialProgramsIds, currentData.personalData_specialPrograms_id)
      : currentData.personalData_specialPrograms_id;

    updatedUserData.personalData_areasAttention_id = isProvided(personalData_areasAttention_id)
      ? firstOrFallback(areasAttentionIds, currentData.personalData_areasAttention_id)
      : currentData.personalData_areasAttention_id;

    updatedUserData.personalData_badHabits_id = isProvided(personalData_badHabits_id)
      ? firstOrFallback(badHabitsIds, currentData.personalData_badHabits_id)
      : currentData.personalData_badHabits_id;

    updatedUserData.personalData_specialEvent_id = isProvided(personalData_specialEvent_id)
      ? firstOrFallback(specialEventIds, currentData.personalData_specialEvent_id)
      : currentData.personalData_specialEvent_id;

    if (isProvided(personalData_specialEvent_date)) {
      updatedUserData.personalData_specialEvent_date = personalData_specialEvent_date;
    }

    const result = await updateData(
      "personaldataregister",
      updatedUserData,
      "personalData_users_id = ?",
      [personalData_users_id]
    );

    if (result.status !== "success") {
      return res.status(500).json({
        status: "failure",
        message: "Failed to update data.",
      });
    }

    connection = await getConnection();
    await ensureMultiSelectTables(connection);

    const personalDataId = currentData.personalData_id;
    if (isProvided(personalData_specialPrograms_id)) {
      await syncSimplePivot(
        connection,
        "personaldataregister_specialprograms",
        "specialPrograms_id",
        personalDataId,
        specialProgramsIds
      );
    }
    if (isProvided(personalData_areasAttention_id)) {
      await syncSimplePivot(
        connection,
        "personaldataregister_areasattention",
        "areasAttention_id",
        personalDataId,
        areasAttentionIds
      );
    }
    if (isProvided(personalData_badHabits_id)) {
      await syncSimplePivot(
        connection,
        "personaldataregister_badhabits",
        "badHabits_id",
        personalDataId,
        badHabitsIds
      );
    }
    if (isProvided(personalData_specialEvent_id)) {
      await syncSpecialEventsPivot(
        connection,
        personalDataId,
        specialEventIds,
        isProvided(personalData_specialEvent_date)
          ? personalData_specialEvent_date
          : updatedUserData.personalData_specialEvent_date || null
      );
    }

    return res.json({
      status: "success",
      message: "Update data successfully.",
    });
  } catch (error) {
    console.error("Error updating data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem updating data",
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = { updatePDR };


/*
const { getData, updateData } = require("../../../controllers/functions");
// START ADDED: normalize multi-select fields before update
const {
  normalizeMultiSelectPayload,
} = require("../../../controllers/personalDataMultiSelect");
// END ADDED: normalize multi-select fields before update

async function updatePDR(req, res) {
  try {
    // START ADDED: support single value, array, and CSV for multi-select fields
    const normalizedBody = normalizeMultiSelectPayload(req.body);
    // END ADDED: support single value, array, and CSV for multi-select fields
    const {
      personalData_users_id,
      personalData_username,
      personalData_birthdate,
      personalData_height,
      personalData_currentWeight,
      personalData_goalWeight,
      personalData_activities_id,
      personalData_specialPrograms_id,
      personalData_offers_id,
      personalData_dietType_id,
      personalData_badHabits_id,
      personalData_areasAttention_id,
      personalData_specialEvent_id,
    } = normalizedBody;

    const currentDataResult = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [personalData_users_id],
      true
    );

    if (currentDataResult.status !== "success" || !currentDataResult.data) {
      return res
        .status(404)
        .json({ status: "failure", message: "User not found" });
    }

    const currentData = currentDataResult.data;
    const updatedUserData = {};

    if (personalData_username && personalData_username.length > 0) {
      updatedUserData.personalData_username = personalData_username;
      updateData("users", { users_name: personalData_username }, "users_id = ?", [
        personalData_users_id,
      ]);
    } else {
      updatedUserData.personalData_username = currentData.personalData_username;
    }

    if (personalData_birthdate != "") {
      updatedUserData.personalData_birthdate = personalData_birthdate;
    } else {
      updatedUserData.personalData_birthdate = currentData.personalData_birthdate;
    }

    if (personalData_height != "") {
      updatedUserData.personalData_height = personalData_height;
    } else {
      updatedUserData.personalData_height = currentData.personalData_height;
    }

    if (personalData_currentWeight != "") {
      updatedUserData.personalData_currentWeight = personalData_currentWeight;
    } else {
      updatedUserData.personalData_currentWeight =
        currentData.personalData_currentWeight;
    }

    if (personalData_goalWeight != "") {
      updatedUserData.personalData_goalWeight = personalData_goalWeight;
    } else {
      updatedUserData.personalData_goalWeight = currentData.personalData_goalWeight;
    }

    if (personalData_activities_id != "") {
      updatedUserData.personalData_activities_id = personalData_activities_id;
    } else {
      updatedUserData.personalData_activities_id =
        currentData.personalData_activities_id;
    }

    if (personalData_specialPrograms_id != "") {
      updatedUserData.personalData_specialPrograms_id =
        personalData_specialPrograms_id;
    } else {
      updatedUserData.personalData_specialPrograms_id =
        currentData.personalData_specialPrograms_id;
    }

    if (
      typeof personalData_offers_id !== "undefined" &&
      personalData_offers_id !== ""
    ) {
      updatedUserData.personalData_offers_id = personalData_offers_id;
    } else {
      updatedUserData.personalData_offers_id = currentData.personalData_offers_id;
    }

    if (
      personalData_dietType_id != "" &&
      personalData_dietType_id != null &&
      personalData_dietType_id != undefined &&
      personalData_dietType_id != "null"
    ) {
      updatedUserData.personalData_dietType_id = personalData_dietType_id;
    } else {
      updatedUserData.personalData_dietType_id = currentData.personalData_dietType_id;
    }

    if (
      personalData_badHabits_id != "" &&
      personalData_badHabits_id != null &&
      personalData_badHabits_id != undefined
    ) {
      // START ADDED: preserve multi-select bad habits in existing column
      updatedUserData.personalData_badHabits_id = personalData_badHabits_id;
      // END ADDED: preserve multi-select bad habits in existing column
    } else {
      updatedUserData.personalData_badHabits_id = currentData.personalData_badHabits_id;
    }

    if (
      personalData_areasAttention_id != "" &&
      personalData_areasAttention_id != null &&
      personalData_areasAttention_id != undefined
    ) {
      // START ADDED: preserve multi-select areas of attention in existing column
      updatedUserData.personalData_areasAttention_id =
        personalData_areasAttention_id;
      // END ADDED: preserve multi-select areas of attention in existing column
    } else {
      updatedUserData.personalData_areasAttention_id =
        currentData.personalData_areasAttention_id;
    }

    if (
      personalData_specialEvent_id != "" &&
      personalData_specialEvent_id != null &&
      personalData_specialEvent_id != undefined
    ) {
      // START ADDED: preserve multi-select special events in existing column
      updatedUserData.personalData_specialEvent_id = personalData_specialEvent_id;
      // END ADDED: preserve multi-select special events in existing column
    } else {
      updatedUserData.personalData_specialEvent_id =
        currentData.personalData_specialEvent_id;
    }

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
*/
/*
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
      personalData_offers_id,
      personalData_dietType_id,  // Added diet type field
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
    

    // تحديث القيم فقط إذا كانت غير null أو غير خالية
    const updatedUserData = {};

    // فقط القيم غير null/غير فارغة
    if (personalData_username && personalData_username.length > 0) {
      updatedUserData.personalData_username = personalData_username;
      updateData(
        "users",
        { users_name: personalData_username },
        "users_id = ?",
        [personalData_users_id]
      );
    } else {
      updatedUserData.personalData_username = currentData.personalData_username;
    }

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
 
    if (typeof personalData_offers_id !== 'undefined' && personalData_offers_id !== '')
      updatedUserData.personalData_offers_id = personalData_offers_id;
    else
      updatedUserData.personalData_offers_id = currentData.personalData_offers_id;
      
    // Add diet type update - Handle empty strings and invalid values properly
    if (personalData_dietType_id != '' && personalData_dietType_id != null && personalData_dietType_id != undefined && personalData_dietType_id != 'null') {
      // Only update if it's a valid value (not empty string, null, or 'null')
      updatedUserData.personalData_dietType_id = personalData_dietType_id;
    } else {
      // Keep the current value if no valid update value is provided
      updatedUserData.personalData_dietType_id = currentData.personalData_dietType_id;
    }

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
*/
