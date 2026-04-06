const express = require("express");
const router = express.Router();
// START ADDED: admin-only protection for financial routes
const { requireAdmin } = require("../../middleware/auth");
// END ADDED: admin-only protection for financial routes

// استيراد وظائف الـ Financial
const { getPayments, getRevenueByYearAndMonth } = require("../../query/Financial/getPayments");

// Route لجلب جميع المدفوعات
// START ADDED: protect financial routes with bearer token
router.get("/getPayments", requireAdmin, getPayments);

// Route لحساب الإيرادات والدفعات بناءً على السنة والشهر
router.post("/getRevenueAndPayments", requireAdmin, getRevenueByYearAndMonth);
// END ADDED: protect financial routes with bearer token

module.exports = router;

/*
const express = require("express");
const router = express.Router();

// استيراد وظائف الـ Financial
const { getPayments, getRevenueByYearAndMonth } = require("../../query/Financial/getPayments");

// Route لجلب جميع المدفوعات
router.get("/getPayments", getPayments);

// Route لحساب الإيرادات والدفعات بناءً على السنة والشهر
router.post("/getRevenueAndPayments", getRevenueByYearAndMonth);

module.exports = router;
*/
