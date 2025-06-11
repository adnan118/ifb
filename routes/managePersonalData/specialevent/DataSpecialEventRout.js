const express = require("express");

const {
  uploadImages,
  insertDataSpecialEvent,
} = require("../../../query/managePersonalData/specialevent/insertDataSpecialEvent");

const {
  updateDataSpecialEvent,
} = require("../../../query/managePersonalData/specialevent/updateDataSpecialEvent");

const {
  deleteDataSpecialEvent,
} = require("../../../query/managePersonalData/specialevent/deleteDataSpecialEvent");

const {
  getDataSpecialEvent,
} = require("../../../query/managePersonalData/specialevent/getDataSpecialEvent");

const router = express.Router();

router.post("/insertDataSpecialEvent", uploadImages, insertDataSpecialEvent);
router.post("/updateDataSpecialEvent", uploadImages, updateDataSpecialEvent);
router.post("/deleteDataSpecialEvent", deleteDataSpecialEvent);
router.post("/getDataSpecialEvent", getDataSpecialEvent);

module.exports = router; 