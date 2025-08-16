const {
  updateData,
  insertData,
  getData
} = require("../../../controllers/functions");

async function updateOrInsertTrackingWeight(req, res) {
  try {
    const { 
      trakingWeight_user_id, 
      trakingWeight_current,
      trakingWeight_target // إضافة الوزن المستهدف كمعامل اختياري
    } = req.body;

    // التحقق من وجود البيانات المطلوبة
    if (!trakingWeight_user_id || !trakingWeight_current) {
      return res.status(400).json({
        status: "failure",
        message: "Missing required fields: trakingWeight_user_id and trakingWeight_current are required."
      });
    }

    // Get current date and time
    const now = new Date();
    const currentTimestamp = now.toISOString();

    console.log("Input data:", { trakingWeight_user_id, trakingWeight_current, trakingWeight_target }); // Debug log

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

      // تحضير بيانات التحديث
      const updateFields = {
        trakingWeight_pre: checkResult.data.trakingWeight_current,
        trakingWeight_current: trakingWeight_current,
        trakingWeight_lastedit: currentTimestamp
      };

      // إضافة الوزن المستهدف إذا تم توفيره
      if (trakingWeight_target) {
        updateFields.trakingWeight_target = trakingWeight_target;
      }

      console.log("Update fields:", updateFields); // Debug log

      // Update existing record
      const result = await updateData(
        "trakingweight",
        updateFields,
        "trakingWeight_user_id = ?",
        [trakingWeight_user_id]
      );

      console.log("Update Result:", result); // Debug log

      if (result && result.status === "success") {
        // تحضير بيانات تحديث جدول البيانات الشخصية
        const personalDataFields = {
          personalData_currentWeight: trakingWeight_current
        };

        // إضافة الوزن المستهدف إذا تم توفيره
        if (trakingWeight_target) {
          personalDataFields.personalData_goalWeight = trakingWeight_target;
        }

        console.log("Personal data update fields:", personalDataFields); // Debug log

        // Update personalData_currentWeight and personalData_goalWeight in personaldataregister table
        const personalDataUpdateResult = await updateData(
          "personaldataregister",
          personalDataFields,
          "personalData_user_id = ?",
          [trakingWeight_user_id]
        );

        console.log("Personal Data Update Result:", personalDataUpdateResult); // Debug log

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

      // تحضير بيانات الإدراج
      const insertFields = {
        trakingWeight_user_id: trakingWeight_user_id,
        trakingWeight_pre: trakingWeight_current,
        trakingWeight_current: trakingWeight_current,
        trakingWeight_lastedit: currentTimestamp
      };

      // إضافة الوزن المستهدف إذا تم توفيره
      if (trakingWeight_target) {
        insertFields.trakingWeight_target = trakingWeight_target;
      }

      console.log("Insert fields:", insertFields); // Debug log

      // Create new record
      const insertResult = await insertData("trakingweight", insertFields);

      console.log("Insert Result:", insertResult); // Debug log

      if (insertResult && insertResult.status === "success") {
        // تحضير بيانات تحديث جدول البيانات الشخصية
        const personalDataFields = {
          personalData_currentWeight: trakingWeight_current
        };

        // إضافة الوزن المستهدف إذا تم توفيره
        if (trakingWeight_target) {
          personalDataFields.personalData_goalWeight = trakingWeight_target;
        }

        console.log("Personal data update fields:", personalDataFields); // Debug log

        // Update personalData_currentWeight and personalData_goalWeight in personaldataregister table
        const personalDataUpdateResult = await updateData(
          "personaldataregister",
          personalDataFields,
          "personalData_user_id = ?",
          [trakingWeight_user_id]
        );

        console.log("Personal Data Update Result:", personalDataUpdateResult); // Debug log

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
