// routes/routes.js
const express = require("express");
// START ADDED: admin-only protection for bulk personal data route
const { requireAdmin, requireAuth, optionalAuth } = require("../../middleware/auth");
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

const {
  changeUserPlan,
} = require("../../query/managePersonalData/personaldata/changeUserPlan");

const {
  approvePlanChangeRequest,
  cancelPlanChangeRequest,
  createPlanChangeRequest,
  getMyPlanChangeRequests,
  getPlanChangeRequestsForAdmin,
  getSelectableOffers,
  rejectPlanChangeRequest,
} = require("../../query/managePersonalData/planChangeRequests/planChangeRequests");

const router = express.Router();

router.post("/insertPersonalDataRegister", requireAuth, insertPersonalDataRegister);
router.post("/updatePDR", requireAuth, updatePDR);
router.post("/getPDR", optionalAuth, getPDR);
// START ADDED: protect bulk personal data listing with bearer token
router.post("/getAllUsersPDR", requireAdmin, getAllUsersPDR);
// END ADDED: protect bulk personal data listing with bearer token

router.post("/updatePaymentStatus", requireAdmin, updatePaymentStatus);
router.post("/changeUserPlan", requireAdmin, changeUserPlan);

// User-facing program-change flow. These endpoints never expose prices.
router.post("/getSelectableOffers", requireAuth, getSelectableOffers);
router.post("/createPlanChangeRequest", requireAuth, createPlanChangeRequest);
router.post("/getMyPlanChangeRequests", requireAuth, getMyPlanChangeRequests);
router.post("/cancelPlanChangeRequest", requireAuth, cancelPlanChangeRequest);

// Admin-only review flow. The price and coupon snapshot are visible only here.
router.post("/getPlanChangeRequests", requireAdmin, getPlanChangeRequestsForAdmin);
router.post("/approvePlanChangeRequest", requireAdmin, approvePlanChangeRequest);
router.post("/rejectPlanChangeRequest", requireAdmin, rejectPlanChangeRequest);
router.post("/deletePersonalData", requireAuth, deletePersonalData);

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

