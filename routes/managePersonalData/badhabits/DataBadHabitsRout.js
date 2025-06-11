const express = require("express");
const router = express.Router();

const {
  uploadImages,
  insertDataBadHabits,
} = require("../../../query/managePersonalData/badhabits/insertDataBadHabits");

const {
  updateDataBadHabits,
} = require("../../../query/managePersonalData/badhabits/updateDataBadHabits");

const {
  deleteDataBadHabits,
} = require("../../../query/managePersonalData/badhabits/deleteDataBadHabits");

const {
  getDataBadHabits,
} = require("../../../query/managePersonalData/badhabits/getDataBadHabits");

router.post("/insertDataBadHabits", uploadImages, insertDataBadHabits);
router.post("/updateDataBadHabits", uploadImages, updateDataBadHabits);
router.post("/deleteDataBadHabits", deleteDataBadHabits);
router.post("/getDataBadHabits"   , getDataBadHabits);

module.exports = router; 