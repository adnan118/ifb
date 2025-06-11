const express = require('express');
const { uploadImages, insertDataChallenges } = require('../../query/challenges/insertDataChallenges');
const {    updateDataChallenges,} = require("../../query/challenges/updateDataChallenges");
const { getDataChallenges } = require('../../query/challenges/getDataChallenges');
const {
  deleteDataChallenges,
} = require("../../query/challenges/deleteDataChallenges"); 


const router = express.Router();
router.post("/insertDataChallenges", uploadImages, insertDataChallenges);
router.post("/updateDataChallenges", uploadImages, updateDataChallenges);

router.post("/getDataChallenges", getDataChallenges);
router.post("/deleteDataChallenges", deleteDataChallenges);

 
module.exports = router; 