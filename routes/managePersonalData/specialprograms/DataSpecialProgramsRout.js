const express = require("express");

const {
  uploadImages,
  insertDataSpecialPrograms,
} = require("../../../query/managePersonalData/specialprograms/insertDataSpecialPrograms");

const {
  updateDataSpecialPrograms,
} = require("../../../query/managePersonalData/specialprograms/updateDataSpecialPrograms");

const {
  deleteDataSpecialPrograms,
} = require("../../../query/managePersonalData/specialprograms/deleteDataSpecialPrograms");

const {
  getDataSpecialPrograms,
} = require("../../../query/managePersonalData/specialprograms/getDataSpecialPrograms");


const router = express.Router();

router.post("/insertDataSpecialPrograms", uploadImages, insertDataSpecialPrograms);
router.post("/updateDataSpecialPrograms", uploadImages, updateDataSpecialPrograms);
router.post("/deleteDataSpecialPrograms", deleteDataSpecialPrograms);
router.post("/getDataSpecialPrograms", getDataSpecialPrograms);
module.exports = router; 


 