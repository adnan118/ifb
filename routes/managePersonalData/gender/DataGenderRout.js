// routes/routes.js
const express = require("express");

 const {
  insertDataGender,
  uploadGenderImages,
} = require("../../../query/managePersonalData/gender/insertDataGender");

const {
  deleteDataGender,
  deleteImages,
} = require("../../../query/managePersonalData/gender/deleteDataGender");

const {
  updateDataGender,
} = require("../../../query/managePersonalData/gender/updateDataGender");

const {
  getDataGender,
} = require("../../../query/managePersonalData/gender/getDataGender");

const router = express.Router();

// & تعيين المسارات
router.post("/insertDataGender", uploadGenderImages, insertDataGender);
router.post("/deleteDataGender", deleteDataGender, deleteImages);
router.post("/updateDataGender", uploadGenderImages, updateDataGender);
router.post("/getDataGender", getDataGender);

module.exports = router;
