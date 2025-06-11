const {
    insertData, 
  } = require("../../controllers/functions");
  
  async function insertDataFeedback(req, res) {
    try {
      const {
        feedbacks_user_id,
        feedbacks_body
      } = req.body;
  
      // Get current date
      const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  
      // Prepare insert data
      const insertFeedbackData = {
        feedbacks_user_id: feedbacks_user_id,
        feedbacks_body: feedbacks_body,
        feedbacks_date: currentDate
      };
  
      const result = await insertData("feedbacks", insertFeedbackData);
  
      if (result.status === "success") {
        res.json({
          status: "success",
          message: "Feedback data inserted successfully.",
          data: insertFeedbackData,
        });
      } else {
        res.status(500).json({
          status: "failure",
          message: "Failed to insert feedback data.",
        });
      }
    } catch (error) {
      console.error("Error in inserting feedback data:", error);
      res.status(500).json({
        status: "failure",
        message: "There is a problem inserting feedback data",
        error: error.message,
      });
    }
  }
  
  module.exports = { insertDataFeedback };