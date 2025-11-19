
const { getData } = require("../../../controllers/functions");

const getUserDietType = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        status: "failure",
        message: "User ID is required"
      });
    }

    // Get user's personal data which contains the diet type ID
    const personalDataResult = await getData(
      "personaldataregister",
      "personalData_users_id = ?",
      [userId]
    );

    if (personalDataResult.status !== "success") {
      return res.status(404).json({
        status: "failure",
        message: "User personal data not found"
      });
    }

    const dietTypeId = personalDataResult.data.personalData_dietType_id;

    // Get the diet type details
    const dietTypeResult = await getData(
      "diettype",
      "diettype_id = ?",
      [dietTypeId]
    );

    if (dietTypeResult.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Diet type fetched successfully",
        data: dietTypeResult.data
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Error fetching diet type details"
      });
    }
  } catch (error) {
    console.error("Error in getUserDietType:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  getUserDietType
};
