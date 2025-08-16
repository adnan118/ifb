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

    // 1. Check if user has a record
    const checkResult = await getData(
      "trakingweight",
      "trakingWeight_user_id = ?",
      [trakingWeight_user_id]
    );

    // Debug: Check if getData failed
    if (!checkResult) {
      return res.status(500).json({
        status: "failure",
        message: "Database connection error while checking existing record."
      });
    }

    // Check if we have a valid record
    if (checkResult && checkResult.data && checkResult.data.trakingWeight_id) {
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

      // Update existing record
      const result = await updateData(
        "trakingweight",
        updateFields,
        "trakingWeight_user_id = ?",
        [trakingWeight_user_id]
      );

      if (!result) {
        return res.status(500).json({
          status: "failure",
          message: "Database connection error during update operation."
        });
      }

      if (result.status === "success") {
        // تحضير بيانات تحديث جدول البيانات الشخصية
        const personalDataFields = {
          personalData_currentWeight: trakingWeight_current
        };

        // إضافة الوزن المستهدف إذا تم توفيره
        if (trakingWeight_target) {
          personalDataFields.personalData_goalWeight = trakingWeight_target;
        }

        // Update personalData_currentWeight and personalData_goalWeight in personaldataregister table
        const personalDataUpdateResult = await updateData(
          "personaldataregister",
          personalDataFields,
          "personalData_users_id = ?",
          [trakingWeight_user_id]
        );

        let message = "Weight tracking data updated successfully.";
        if (personalDataUpdateResult && personalDataUpdateResult.status === "success") {
          message += " Personal data also updated.";
        } else {
          message += " Warning: Personal data update failed.";
        }

        res.json({
          status: "success",
          message: message,
          data: result.data,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: `Failed to update weight tracking data. Error: ${result.message || 'Unknown error'}`,
        });
      }
    } else {
      // No existing record found, creating new one
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

      // Create new record
      const insertResult = await insertData("trakingweight", insertFields);

      if (!insertResult) {
        return res.status(500).json({
          status: "failure",
          message: "Database connection error during insert operation."
        });
      }

      if (insertResult.status === "success") {
        // تحضير بيانات تحديث جدول البيانات الشخصية
        const personalDataFields = {
          personalData_currentWeight: trakingWeight_current
        };

        // إضافة الوزن المستهدف إذا تم توفيره
        if (trakingWeight_target) {
          personalDataFields.personalData_goalWeight = trakingWeight_target;
        }

        // Update personalData_currentWeight and personalData_goalWeight in personaldataregister table
        const personalDataUpdateResult = await updateData(
          "personaldataregister",
          personalDataFields,
          "personalData_users_id = ?",
          [trakingWeight_user_id]
        );

        let message = "New weight tracking record inserted successfully.";
        if (personalDataUpdateResult && personalDataUpdateResult.status === "success") {
          message += " Personal data also updated.";
        } else {
          message += " Warning: Personal data update failed.";
        }

        res.json({
          status: "success",
          message: message,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: `Failed to insert new weight tracking record. Error: ${insertResult.message || 'Unknown error'}`,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: `There is a problem processing your request. Error: ${error.message}`,
    });
  }
}

module.exports = { updateOrInsertTrackingWeight };
