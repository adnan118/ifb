// routes/routes.js
const express = require("express");


const {
  insertDataGoals,
  uploadImages,
} = require("../../../query/managePersonalData/goal/insertDataGoals");

const {
  deleteDataGoals,
  deleteImages,
} = require("../../../query/managePersonalData/goal/deleteDataGoals");

const {
  updateDataGoals, 
} = require("../../../query/managePersonalData/goal/updateDataGoals");

const {
  getDataGoal,
} = require("../../../query/managePersonalData/goal/getDataGoal");

const router = express.Router();

router.post("/insertDataGoals",uploadImages, insertDataGoals); 
router.post("/deleteDataGoals", deleteDataGoals, deleteImages);
router.post("/updateDataGoals", uploadImages, updateDataGoals);
router.post("/getDataGoal", getDataGoal);
module.exports = router;



  