const {
    updateData,
  } = require("../../controllers/functions");
  
  async function updateDataFeedback(req, res) {
    try {
      const { feedbacks_id, feedbacks_user_id, feedbacks_body } = req.body;

      // Get current date
const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updateFeedbackData = {
        feedbacks_user_id: feedbacks_user_id,
        feedbacks_body: feedbacks_body,
        feedbacks_date: currentDate,
      };

const result = await updateData(
  "feedbacks",
  updateFeedbackData,
  "feedbacks_id = ?",
  [feedbacks_id]
);

      if (result.status === "success") {
        res.json({
          status: "success",
          message: "Feedback data updated successfully.",
          data: updateFeedbackData,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to update feedback data.",
        });
      }
    } catch (error) {
      console.error("Error in updating feedback data:", error);
      res.status(500).json({
        status: "failure",
        message: "There is a problem updating feedback data",
        error: error.message,
      });
    }
  }
  

  module.exports = { updateDataFeedback };
