const express = require("express");
const router = express.Router();

// استيراد وظائف الـ Financial
const { getPayments, getRevenueByYearAndMonth } = require("../../query/Financial/getPayments");

// Route لجلب جميع المدفوعات
router.get("/getPayments", getPayments);

// Route لحساب الإيرادات بناءً على السنة والشهر
router.post("/getRevenue", getRevenueByYearAndMonth);

module.exports = router;