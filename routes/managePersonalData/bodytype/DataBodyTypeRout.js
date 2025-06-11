const express = require("express");
const router = express.Router();

const {
  uploadImages,
  insertDataBodyType,
} = require("../../../query/managePersonalData/bodytype/insertDataBodyType");

const {
  updateDataBodyType,
} = require("../../../query/managePersonalData/bodytype/updateDataBodyType");

const {
  deleteDataBodyType,
} = require("../../../query/managePersonalData/bodytype/deleteDataBodyType");


const {
  getDataBodyType,
} = require("../../../query/managePersonalData/bodytype/getDataBodyType");



router.post("/insertDataBodyType", uploadImages, insertDataBodyType);
router.post("/updateDataBodyType", uploadImages, updateDataBodyType);
router.post("/deleteDataBodyType", deleteDataBodyType);
router.post("/getDataBodyType", getDataBodyType);

module.exports = router; 