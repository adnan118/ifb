const express = require("express");
const router = express.Router();

const {
  uploadImages,
  insertDataAreasAttention,
} = require("../../../query/managePersonalData/areasattention/insertDataAreasAttention");

const {
  updateDataAreasAttention,
} = require("../../../query/managePersonalData/areasattention/updateDataAreasAttention");

const {
  deleteDataAreasAttention,
} = require("../../../query/managePersonalData/areasattention/deleteDataAreasAttention");

const {
  getDataAreasAttention,
} = require("../../../query/managePersonalData/areasattention/getDataAreasAttention");

router.post("/insertDataAreasAttention", uploadImages, insertDataAreasAttention);
router.post("/updateDataAreasAttention", uploadImages, updateDataAreasAttention);
router.post("/deleteDataAreasAttention", deleteDataAreasAttention);
router.post("/getDataAreasAttention", getDataAreasAttention);

module.exports = router; 