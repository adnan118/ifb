const express = require('express');

const { insertDataReadyTable } = require("../../query/readyTrainingTables/insertDataReadyTable");
const { getDataReadyTables } = require("../../query/readyTrainingTables/getDataReadyTable");
const { updateDataReadyTable } = require("../../query/readyTrainingTables/updateDataReadyTable");
const { deleteDataReadyTable } = require("../../query/readyTrainingTables/deleteDataReadyTable");

const router = express.Router();

// مسار لإدخال بيانات جدول تدريبي جاهز
router.post("/insertDataReadyTable", insertDataReadyTable);

// مسار لجلب البيانات - يمكن استخدامه بطرق مختلفة:
// 1. جلب جميع الجداول (بدون معلمات)
// 2. جلب جدول محدد (مع ready_table_id)
// 3. جلب جداول حسب الفترة (مع period)
router.post("/getDataReadyTables", getDataReadyTables);

// مسار لتحديث بيانات جدول تدريبي جاهز
router.post("/updateDataReadyTable", updateDataReadyTable);

// مسار لحذف جدول تدريبي جاهز
router.post("/deleteDataReadyTable", deleteDataReadyTable);

module.exports = router;
