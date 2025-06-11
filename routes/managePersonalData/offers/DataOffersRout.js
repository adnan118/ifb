const express = require("express");

const {
  insertDataOffers,
} = require("../../../query/managePersonalData/offers/insertDataOffers");

const {
  updateDataOffers,
} = require("../../../query/managePersonalData/offers/updateDataOffers");

const {
  deleteDataOffers,
} = require("../../../query/managePersonalData/offers/deleteDataOffers");

const {
  getDataOffers,
} = require("../../../query/managePersonalData/offers/getDataOffers");


const router = express.Router();

router.post("/insertDataOffers", insertDataOffers);
router.post("/updateDataOffers", updateDataOffers);
router.post("/deleteDataOffers", deleteDataOffers);
router.post("/getDataOffers", getDataOffers);


module.exports = router; 