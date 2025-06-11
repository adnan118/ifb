const express = require("express");
const router = express.Router();

const {
  uploadImages,
  insertDataDietType,
} = require("../../../query/managePersonalData/diettype/insertDataDietType");

const {
  updateDataDietType,
} = require("../../../query/managePersonalData/diettype/updateDataDietType");

const {
  deleteDataDietType,
} = require("../../../query/managePersonalData/diettype/deleteDataDietType");

const {
  getDataDietType,
} = require("../../../query/managePersonalData/diettype/getDataDietType");

router.post("/insertDataDietType", uploadImages, insertDataDietType);
router.post("/updateDataDietType", uploadImages, updateDataDietType);
router.post("/deleteDataDietType", deleteDataDietType);
router.post("/getDataDietType", getDataDietType);

module.exports = router; 