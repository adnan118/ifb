const express = require("express");

const {
  uploadImages,
  insertDataRestNight,
} = require("../../../query/managePersonalData/restnight/insertDataRestNight");

const {
  updateDataRestNight,
} = require("../../../query/managePersonalData/restnight/updateDataRestNight");

const {
  deleteDataRestNight,
} = require("../../../query/managePersonalData/restnight/deleteDataRestNight");

const {
  getDataRestNight,
} = require("../../../query/managePersonalData/restnight/getDataRestNight");


const router = express.Router();

router.post("/insertDataRestNight", uploadImages, insertDataRestNight);
router.post("/updateDataRestNight", uploadImages, updateDataRestNight);
router.post("/deleteDataRestNight", deleteDataRestNight);
router.post("/getDataRestNight", getDataRestNight);

module.exports = router; 


 
