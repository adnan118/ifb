const express = require("express");
const { requireAdmin } = require("../../../middleware/auth");

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

router.post("/insertDataOffers", requireAdmin, insertDataOffers);
router.post("/updateDataOffers", requireAdmin, updateDataOffers);
router.post("/deleteDataOffers", requireAdmin, deleteDataOffers);
router.post("/getDataOffers", getDataOffers);


module.exports = router; 
