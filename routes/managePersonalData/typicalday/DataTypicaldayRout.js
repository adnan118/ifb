// routes/routes.js
const express = require("express");

const {
  uploadImages,
  insertDataTypicalDay,
} = require("../../../query/managePersonalData/typicalday/insertDatatTypicalday");

const {
  updateDataTypicalDay,
} = require("../../../query/managePersonalData/typicalday/updateDataTypicalday");
 
 

const {
  deleteDataTypicalDay,
} = require("../../../query/managePersonalData/typicalday/deleteDataTypicalday");

const {
  getDataTypicalDay,
} = require("../../../query/managePersonalData/typicalday/getDataTypicalDay");


const router = express.Router();
router.post("/insertDataTypicalDay", uploadImages, insertDataTypicalDay);
router.post("/updateDataTypicalDay", uploadImages, updateDataTypicalDay);
router.post("/deleteDataTypicalDay", deleteDataTypicalDay);
router.post("/getDataTypicalDay", getDataTypicalDay);
module.exports = router;

 

  