const express = require('express');
// START ADDED: admin-only protection for challenge management routes
const { requireAdmin } = require("../../middleware/auth");
// END ADDED: admin-only protection for challenge management routes
const { uploadImages, insertDataChallenges } = require('../../query/challenges/insertDataChallenges');
const {    updateDataChallenges,} = require("../../query/challenges/updateDataChallenges");
const { getDataChallenges } = require('../../query/challenges/getDataChallenges');
const {
  deleteDataChallenges,
} = require("../../query/challenges/deleteDataChallenges"); 


const router = express.Router();
// START ADDED: protect challenge write routes with bearer token
router.post("/insertDataChallenges", requireAdmin, uploadImages, insertDataChallenges);
router.post("/updateDataChallenges", requireAdmin, uploadImages, updateDataChallenges);
// END ADDED: protect challenge write routes with bearer token

router.post("/getDataChallenges", getDataChallenges);
// START ADDED: protect challenge delete route with bearer token
router.post("/deleteDataChallenges", requireAdmin, deleteDataChallenges);
// END ADDED: protect challenge delete route with bearer token

 
module.exports = router; 


/*
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
*/
