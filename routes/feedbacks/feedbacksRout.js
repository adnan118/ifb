const express = require('express');
const router = express.Router();

const {
  insertDataFeedback, 
} = require('../../query/feedbacks/insertDataFeedback');
const { updateDataFeedback } = require('../../query/feedbacks/updateDataFeedback');
const { deleteDataFeedback } = require('../../query/feedbacks/deleteDataFeedback');
const { getDataFeedback } = require('../../query/feedbacks/getDataFeedback');

 router.post("/getDataFeedback", getDataFeedback);

 router.post("/insertDataFeedback", insertDataFeedback);

 router.post("/updateDataFeedback", updateDataFeedback);

 router.post("/deleteDataFeedback", deleteDataFeedback);

module.exports = router; 