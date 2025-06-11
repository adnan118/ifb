const express = require("express");

const {
  uploadImages,
  insertDataEnergyLevels,
} = require("../../../query/managePersonalData/energylevels/insertDataEnergyLevels");

const {
  updateDataEnergyLevels,
} = require("../../../query/managePersonalData/energylevels/updateDataEnergyLevels");

const {
  deleteDataEnergyLevels,
} = require("../../../query/managePersonalData/energylevels/deleteDataEnergyLevels");

const {
  getDataEnergyLevels,
} = require("../../../query/managePersonalData/energylevels/getDataEnergyLevels");

const router = express.Router();

router.post("/insertDataEnergyLevels", uploadImages, insertDataEnergyLevels);
router.post("/updateDataEnergyLevels", uploadImages, updateDataEnergyLevels);
router.post("/deleteDataEnergyLevels", deleteDataEnergyLevels);
router.post("/getDataEnergyLevels", getDataEnergyLevels);

module.exports = router; 