const express = require("express");

const {
  uploadImages,
  insertDataLastIdealWeight,
} = require("../../../query/managePersonalData/lastidealweight/insertDataLastIdealWeight");

const {
  updateDataLastIdealWeight,
} = require("../../../query/managePersonalData/lastidealweight/updateDataLastIdealWeight");

const {
  deleteDataLastIdealWeight,
} = require("../../../query/managePersonalData/lastidealweight/deleteDataLastIdealWeight");

const {
  getDataLastIdealWeight,
} = require("../../../query/managePersonalData/lastidealweight/getDataLastIdealWeight");

const router = express.Router();

router.post("/insertDataLastIdealWeight", uploadImages, insertDataLastIdealWeight);
router.post("/updateDataLastIdealWeight", uploadImages, updateDataLastIdealWeight);
router.post("/deleteDataLastIdealWeight", deleteDataLastIdealWeight);
router.post("/getDataLastIdealWeight", getDataLastIdealWeight);

module.exports = router; 