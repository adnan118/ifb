const { getAllData } = require("../../../controllers/functions");

async function getAllUsersPDR(req, res) {
  try {
    // Get all users' personal data register with offers_id and users_id
    const result = await getAllData(
      "personaldataregister",
      "personalData_offers_id IS NOT NULL AND personalData_users_id IS NOT NULL",
      [], // No parameters needed since we're getting all users
    );

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to get data.",
      });
    }
  } catch (error) {
    console.error("Error getting data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem getting data",
    });
  }
}

// تصدير الدالة
module.exports = { getAllUsersPDR }; 
