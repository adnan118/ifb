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
  updatePaymentStatus,
} = require("../../query/managePersonalData/personaldata/updatePaymentStatus");

const router = express.Router();





router.post("/insertPersonalDataRegister", insertPersonalDataRegister);
router.post("/updatePDR", updatePDR);
router.post("/getPDR", getPDR);

// مسار تحديث حالة الدفع
router.post("/updatePaymentStatus", updatePaymentStatus);

;
module.exports = router;
