/*

const { getData } = require("../../controllers/functions");

// جلب تدريبات مستخدم معين
const getDataUserTrainingsByUserId = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        status: "failure",
        message: "Missing required parameter: user_id",
      });
    }

    const result = await getData("user_trainings", "user_id = ?", [user_id]);

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "User trainings fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching user trainings",
      });
    }
  } catch (error) {
    console.error("Error in getData user trainings by user_id:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataUserTrainingsByUserId,

};

*/
