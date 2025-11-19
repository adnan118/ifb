const { getAllData } = require("../../../controllers/functions");

// دالة لاسترجاع بيانات جدول الجنس
const getDataGender = async (req, res) => {
  try {
    const result = await getAllData("gender");

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Gender data fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching gender data",
      });
    }
  } catch (error) {
    console.error("Error in getDataGender:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataGender,
};
