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

    // Get current date and time
    const now = new Date();
    const currentTimestamp = now.toISOString();

    // 1. Check if user has a record
    const checkResult = await getData(
      "trakingweight",
      "trakingWeight_user_id = ?",
      [trakingWeight_user_id]
    );

    console.log("Check Result:", checkResult); // Debug log

    // Check if we have a valid record
    if (checkResult && checkResult.data && checkResult.data.trakingWeight_id) {
      console.log("Found existing record:", checkResult.data); // Debug log

      // Update existing record
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

      console.log("Update Result:", result); // Debug log

      if (result && result.status === "success") {
        res.json({
          status: "success",
          message: "Weight tracking data updated successfully.",
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to update weight tracking data.",
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

      console.log("Insert Result:", insertResult); // Debug log

      if (insertResult && insertResult.status === "success") {
        res.json({
          status: "success",
          message: "New weight tracking record inserted successfully.",
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to insert new weight tracking record.",
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
