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

const {
  getUserDietType,
} = require("../../../query/managePersonalData/diettype/getUserDietType");

const {
  updateUserDietType,
} = require("../../../query/managePersonalData/diettype/updateUserDietType");

router.post("/insertDataDietType", uploadImages, insertDataDietType);
router.post("/updateDataDietType", uploadImages, updateDataDietType);
router.post("/deleteDataDietType", deleteDataDietType);
router.post("/getDataDietType", getDataDietType);
router.post("/getUserDietType", getUserDietType);
router.post("/updateUserDietType", updateUserDietType);

module.exports = router;
