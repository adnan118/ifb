const express = require("express");
const router = express.Router();

const {
  uploadImages,
  insertDataActivities,
} = require("../../../query/managePersonalData/activities/insertDataActivities");

const {
  updateDataActivities,
} = require("../../../query/managePersonalData/activities/updateDataActivities");

const {
  deleteDataActivities,
} = require("../../../query/managePersonalData/activities/deleteDataActivities");

const {
  getDataActivities,
} = require("../../../query/managePersonalData/activities/getDataActivities");

router.post("/insertDataActivities", uploadImages, insertDataActivities);
router.post("/updateDataActivities", uploadImages, updateDataActivities);
router.post("/deleteDataActivities", deleteDataActivities);
router.post("/getDataActivities", getDataActivities);

module.exports = router; 