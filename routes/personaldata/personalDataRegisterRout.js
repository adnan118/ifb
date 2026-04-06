// routes/routes.js
const express = require("express");
// START ADDED: admin-only protection for bulk personal data route
const { requireAdmin } = require("../../middleware/auth");
// END ADDED: admin-only protection for bulk personal data route
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
// START ADDED: protect bulk personal data listing with bearer token
router.post("/getAllUsersPDR", requireAdmin, getAllUsersPDR);
// END ADDED: protect bulk personal data listing with bearer token


// مسار تحديث حالة الدفع
router.post("/updatePaymentStatus", updatePaymentStatus);
// مسار حذف البيانات الشخصية
router.post("/deletePersonalData", deletePersonalData);

;
module.exports = router;



/*
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
*/

