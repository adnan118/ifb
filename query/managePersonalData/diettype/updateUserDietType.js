const { updateData } = require("../../../controllers/functions");

const updateUserDietType = async (req, res) => {
  try {
    const { userId, dietTypeId } = req.body;

    if (!userId || !dietTypeId) {
      return res.status(400).json({
        status: "failure",
        message: "User ID and Diet Type ID are required"
      });
    }

    // Update the user's diet type in personal data
    const updateDataResult = await updateData(
      "personaldataregister",
      { personalData_dietType_id: dietTypeId },
      "personalData_users_id = ?",
      [userId]
    );

    if (updateDataResult.status === "success") {
      res.status(200).json({
        status: "success",
        message: "User diet type updated successfully",
        affectedRows: updateDataResult.affectedRows,
        changedRows: updateDataResult.changedRows
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Error updating user diet type",
        error: updateDataResult.message
      });
    }
  } catch (error) {
    console.error("Error in updateUserDietType:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  updateUserDietType
};
