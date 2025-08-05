const {
  updateData,
  insertData,
  getAllData
} = require("../../../controllers/functions");

async function updateOrInsertTrackingWeight(req, res) {
  try {
    const { 
      trakingWeight_user_id, 
      trakingWeight_current 
    } = req.body;

    // Validate required fields
    if (!trakingWeight_user_id || !trakingWeight_current) {
      return res.status(400).json({
        status: "failure",
        message: "trakingWeight_user_id and trakingWeight_current are required."
      });
    }

    // Get current date and time
    const now = new Date();
    const currentTimestamp = now.toISOString();

    // 1. Check if user has a record
    const checkResult = await getAllData(
      "trakingweight",
      "trakingWeight_user_id = ?",
      [trakingWeight_user_id]
    );

    console.log("Check Result:", checkResult); // Debug log

    // Check if we have a valid record
    if (checkResult && checkResult.status === "success" && checkResult.data && checkResult.data.length > 0) {
      console.log("Found existing record:", checkResult.data); // Debug log

      // Update existing record
      const result = await updateData(
        "trakingweight",
        {
          trakingWeight_pre: checkResult.data[0].trakingWeight_current,
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
        console.error("Update failed:", result);
        res.status(500).json({
          status: "failure",
          message: "Failed to update weight tracking data.",
          error: result?.message || "Unknown error"
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
        console.error("Insert failed:", insertResult);
        res.status(500).json({
          status: "failure",
          message: "Failed to insert new weight tracking record.",
          error: insertResult?.message || "Unknown error"
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
