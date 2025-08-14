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


const {
  deletePersonalData,
} = require("../../query/managePersonalData/personaldata/deletePersonalData");


const {
  updatePaymentStatus,
} = require("../../query/managePersonalData/personaldata/updatePaymentStatus");

const router = express.Router();





router.post("/insertPersonalDataRegister", insertPersonalDataRegister);
router.post("/updatePDR", updatePDR);
router.post("/getPDR", getPDR);
router.post("/getAllUsersPDR", getAllUsersPDR);


// مسار تحديث حالة الدفع
router.post("/updatePaymentStatus", updatePaymentStatus);
// مسار حذف البيانات الشخصية
router.post("/deletePersonalData", deletePersonalData);

;
module.exports = router;


