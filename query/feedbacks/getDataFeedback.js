const {
  getAllData,
} = require("../../controllers/functions");

async function getDataFeedback(req, res) {
  try {
    const result = await getAllData("feedbacks");

    if (result.status === "success") {
      res.json({
        status: "success",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Failed to get feedback data.",
      });
    }
  } catch (error) {
    console.error("Error in getting feedback data:", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem getting feedback data",
      error: error.message,
    });
  }
}


module.exports = { getDataFeedback }; 
