const { getAllData } = require("../../../controllers/functions");

const getDataTrackingWeight = async (req, res) => {
  try {
    const { trakingWeight_user_id } = req.body;

    const result = await getAllData(
      "trakingweight",
      "trakingWeight_user_id=?",
      [trakingWeight_user_id]
    );

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Tracking weight data fetched successfully",
        data: result.data,
      });
      console.log("Tracking weight data fetched successfully");
      console.log(result.data);
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching tracking weight data",
      });
    }
  } catch (error) {
    console.error("Error in getData tracking weight:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataTrackingWeight,
};
