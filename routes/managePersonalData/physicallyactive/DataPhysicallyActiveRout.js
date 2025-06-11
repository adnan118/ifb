const express = require("express");

const {
  uploadImages,
  insertDataPhysicallyActive,
} = require("../../../query/managePersonalData/physicallyactive/insertDataPhysicallyActive");

const {
  updateDataPhysicallyActive,
} = require("../../../query/managePersonalData/physicallyactive/updateDataPhysicallyActive");

const {
  deleteDataPhysicallyActive,
} = require("../../../query/managePersonalData/physicallyactive/deleteDataPhysicallyActive");

const {
  getDataPhysicallyActive,
} = require("../../../query/managePersonalData/physicallyactive/getDataPhysicallyActive");

const router = express.Router();

router.post("/insertDataPhysicallyActive", uploadImages, insertDataPhysicallyActive);
router.post("/updateDataPhysicallyActive", uploadImages, updateDataPhysicallyActive);
router.post("/deleteDataPhysicallyActive", deleteDataPhysicallyActive);
router.post("/getDataPhysicallyActive", getDataPhysicallyActive);

module.exports = router; 