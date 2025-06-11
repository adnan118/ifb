const express = require("express");
const router = express.Router();

const {
  uploadImages,
  insertDataDailyWater,
} = require("../../../query/managePersonalData/dailywater/insertDataDailyWater");

const {
  updateDataDailyWater,
} = require("../../../query/managePersonalData/dailywater/updateDataDailyWater");

const {
  deleteDataDailyWater,
} = require("../../../query/managePersonalData/dailywater/deleteDataDailyWater");

const {
  getDataDailyWater,
} = require("../../../query/managePersonalData/dailywater/getDataDailyWater");

router.post("/insertDataDailyWater", uploadImages, insertDataDailyWater);
router.post("/updateDataDailyWater", uploadImages, updateDataDailyWater);
router.post("/deleteDataDailyWater", deleteDataDailyWater);
router.post("/getDataDailyWater", getDataDailyWater);

module.exports = router; 