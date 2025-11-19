const { getData,getAllData } = require("../../controllers/functions");

// جلب أطعمة مستخدم معين
const getDataUserFoodsByUserId = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        status: "failure",
        message: "Missing required parameter: user_id",
      });
    }

    const result = await getAllData("user_foods", "user_id = ?", [user_id]);

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "User foods fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching user foods",
      });
    }
  } catch (error) {
    console.error("Error in getData user foods by user_id:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataUserFoodsByUserId,

};

