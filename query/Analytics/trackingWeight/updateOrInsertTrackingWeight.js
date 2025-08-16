const {
  updateData,
  insertData,
  getData
} = require("../../../controllers/functions");

async function updateOrInsertTrackingWeight(req, res) {
  try {
    const { 
      trakingWeight_user_id, 
      trakingWeight_current 
    } = req.body;

    console.log("Request body:", req.body); // Debug log
    console.log("User ID:", trakingWeight_user_id, "Current Weight:", trakingWeight_current); // Debug log

    // Validate input
    if (!trakingWeight_user_id || !trakingWeight_current) {
      return res.status(400).json({
        status: "failure",
        message: "Missing required fields: trakingWeight_user_id and trakingWeight_current are required.",
      });
    }

    // Get current date and time
    const now = new Date();
    const currentTimestamp = now.toISOString();

    // 1. Check if user has a record
    const checkResult = await getData(
      "trakingweight",
      "trakingWeight_user_id = ?",
      [trakingWeight_user_id]
    );

    console.log("Check Result:", JSON.stringify(checkResult, null, 2)); // Debug log

    // Check if we have a valid record
    if (checkResult && checkResult.status === "success") {
      console.log("Found existing record:", checkResult.data); // Debug log

      // Update existing record
      console.log("Attempting to update with data:", {
        trakingWeight_pre: checkResult.data.trakingWeight_current,
        trakingWeight_current: trakingWeight_current,
        trakingWeight_lastedit: currentTimestamp
      });
      console.log("Update condition:", "trakingWeight_user_id = ?", [trakingWeight_user_id]);
      
      const result = await updateData(
        "trakingweight",
        {
          trakingWeight_pre: checkResult.data.trakingWeight_current,
          trakingWeight_current: trakingWeight_current,
          trakingWeight_lastedit: currentTimestamp
        },
        "trakingWeight_user_id = ?",
        [trakingWeight_user_id]
      );

      console.log("Update Result:", JSON.stringify(result, null, 2)); // Debug log

      if (result && result.status === "success") {
        // Update personalData_currentWeight in personaldataregister table
        const personalDataUpdateResult = await updateData(
          "personaldataregister",
          {
            personalData_currentWeight: trakingWeight_current
          },
          "personalData_users_id = ?",
          [trakingWeight_user_id]
        );

        console.log("Personal Data Update Result:", JSON.stringify(personalDataUpdateResult, null, 2)); // Debug log

        res.json({
          status: "success",
          message: "Weight tracking data updated successfully.",
          data: result.data,
        });
      } else {
        console.log("Update failed. Result status:", result ? result.status : "null result"); // Debug log
        console.log("Full result object:", JSON.stringify(result, null, 2)); // Debug log
        res.status(500).json({
          status: "failure",
          message: "Failed to update weight tracking data.",
          debug: result // Add debug info to response
        });
      }
    } else {
      console.log("No existing record found, creating new one"); // Debug log

      // Create new record
      const insertResult = await insertData("trakingweight", {
        trakingWeight_user_id: trakingWeight_user_id,
        trakingWeight_pre: trakingWeight_current,
        trakingWeight_current: trakingWeight_current,
        trakingWeight_lastedit: currentTimestamp
      });

      console.log("Insert Result:", JSON.stringify(insertResult, null, 2)); // Debug log

      if (insertResult && insertResult.status === "success") {
        // Update personalData_currentWeight in personaldataregister table
        const personalDataUpdateResult = await updateData(
          "personaldataregister",
          {
            personalData_currentWeight: trakingWeight_current
          },
          "personalData_users_id = ?",
          [trakingWeight_user_id]
        );

        console.log("Personal Data Update Result:", JSON.stringify(personalDataUpdateResult, null, 2)); // Debug log

        res.json({
          status: "success",
          message: "New weight tracking record inserted successfully.",
        });
      } else {
        console.log("Insert failed. Result status:", insertResult ? insertResult.status : "null result"); // Debug log
        console.log("Full insert result object:", JSON.stringify(insertResult, null, 2)); // Debug log
        res.status(500).json({
          status: "failure",
          message: "Failed to insert new weight tracking record.",
          debug: insertResult // Add debug info to response
        });
      }
    }
  } catch (error) {
    console.error("Error in updateOrInsertTrackingWeight:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem processing your request.",
    });
  }
}

module.exports = { updateOrInsertTrackingWeight };
