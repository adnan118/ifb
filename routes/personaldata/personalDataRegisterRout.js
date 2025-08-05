// routes/routes.js
const express = require("express");
const {
  insertPersonalDataRegister,
} = require("../../query/managePersonalData/personaldata/insertPersonalDataRegister");

const {
  updatePDR,
} = require("../../query/managePersonalData/personaldata/updatePDR");

const {
  getPDR,
} = require("../../query/managePersonalData/personaldata/getPDR");

const {
  getAllUsersPDR,
} = require("../../query/managePersonalData/personaldata/getAllUsersPDR");


const router = express.Router();





router.post("/insertPersonalDataRegister", insertPersonalDataRegister);
router.post("/updatePDR", updatePDR);
router.post("/getPDR", getPDR);
router.get("/getAllUsersPDR", getAllUsersPDR);

;
module.exports = router;

