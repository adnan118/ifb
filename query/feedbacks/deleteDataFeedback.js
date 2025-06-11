const {
    deleteData,
  } = require("../../controllers/functions");
  
  async function deleteDataFeedback(req, res) {
    try {
      const { feedbacks_id } = req.body;
  
      if (!feedbacks_id) {
        return res.status(400).json({
          status: "failure",
          message: "Feedback ID is required",
        });
      }
  
      const result = await deleteData("feedbacks", `feedbacks_id = ${feedbacks_id}`);
  
      if (result.status === "success") {
        res.json({
          status: "success",
          message: "Feedback data deleted successfully.",
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to delete feedback data.",
        });
      }
    } catch (error) {
      console.error("Error in deleting feedback data:", error);
      res.status(500).json({
        status: "failure",
        message: "There is a problem deleting feedback data",
        error: error.message,
      });
    }
  }
  
  module.exports = { deleteDataFeedback };