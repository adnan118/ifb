const {
  deleteData,
  getData,
  updateData
} = require("../../../controllers/functions");

// دالة لحذف البيانات الشخصية للمستخدم
async function deletePersonalData(req, res) {
  try {
    const { personalData_users_id } = req.body || {};
    
    // التحقق من وجود معرف المستخدم
    if (!Number.isInteger(Number(personalData_users_id)) || Number(personalData_users_id) <= 0) {
      return res.status(400).json({
        status: "failure",
        message: "You must provide the user's ID.",
      });
    }

    const requestedUserId = Number(personalData_users_id);

    // الحصول على البيانات الشخصية قبل حذفها
    const personalDataResult = await getData(
      "personaldataregister", 
      "personalData_users_id = ?", 
      [requestedUserId]
    );

    const personalDataExists =
      personalDataResult.status === "success" && personalDataResult.data;

    if (personalDataResult.status !== "success" && personalDataResult.message !== "No Data") {
      return res.status(500).json({
        status: "failure",
        message: "Failed to read personal data before deletion.",
      });
    }

    if (personalDataExists) {
      // حذف البيانات الشخصية من الجدول الرئيسي
      const deleteResult = await deleteData(
        "personaldataregister", 
        "personalData_users_id = ?", 
        [requestedUserId]
      );

      if (deleteResult.status !== "success") {
        res.status(500).json({
          status: "failure",
          message: "Failed to delete personal data.",
        });
        return;
      }
    }

    // This deletion is idempotent: an account may not have completed its
    // personal-data setup, or a previous deletion may have already removed it.
    const trackingWeightDeleteResult = await deleteData(
      "trakingweight",
      "trakingWeight_user_id = ?",
      [requestedUserId]
    );

    if (trackingWeightDeleteResult.status !== "success") {
      return res.status(500).json({
        status: "failure",
        message: "Failed to delete tracking data.",
      });
    }

    const userUpdateResult = await updateData(
      "users",
      {
        users_haveoldaccount: 0,
        users_name: null,
      },
      "users_id = ?",
      [requestedUserId]
    );

    if (userUpdateResult.status !== "success") {
      return res.status(500).json({
        status: "failure",
        message: "Failed to update the user account.",
      });
    }

    res.json({
      status: "success",
      message: personalDataExists
        ? "Personal data deleted successfully."
        : "Personal data was already deleted or was not created.",
      data: {
        personalData_users_id: requestedUserId,
        personalData_username: personalDataResult.data?.personalData_username ?? null,
        deleted_records: {
          personal_data: personalDataExists,
          tracking_weight: true,
          user_status_updated: true,
        },
      },
    });
  } catch (error) {
    console.error("Error deleting personal data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem deleting personal data",
    });
  }
}

module.exports = { deletePersonalData };
