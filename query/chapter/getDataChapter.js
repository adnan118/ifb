const { getAllData } = require("../../controllers/functions");

const getDataChapters = async (req, res) => {
  try {
    const result = await getAllData("chapter");

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Chapters fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching chapters",
      });
    }
  } catch (error) {
    console.error("Error in getData chapters:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDataChapters,
};
