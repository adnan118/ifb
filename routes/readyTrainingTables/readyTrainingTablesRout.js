const express = require('express');

// Old API (for backward compatibility - can be removed later)
const { insertDataReadyTable } = require("../../query/readyTrainingTables/insertDataReadyTable");
const { getDataReadyTables } = require("../../query/readyTrainingTables/getDataReadyTable");
const { updateDataReadyTable } = require("../../query/readyTrainingTables/updateDataReadyTable");
const { deleteDataReadyTable } = require("../../query/readyTrainingTables/deleteDataReadyTable");

// New Training Tables System APIs
const { insertTrainingTable, insertMealToTable } = require("../../query/readyTrainingTables/insertTrainingTable");
const { 
  getTrainingTables, 
  getMealsByTableId, 
  getAllMealsWithTables 
} = require("../../query/readyTrainingTables/getTrainingTable");
const { 
  updateTrainingTable, 
  updateMealInTable, 
  deleteMealFromTable,
  deleteTrainingTable 
} = require("../../query/readyTrainingTables/updateDeleteTrainingTable");

const router = express.Router();

// ========================================
// New Training Tables System Routes
// ========================================

// Training Tables Management
router.post("/insertTrainingTable", insertTrainingTable);
router.post("/getTrainingTables", getTrainingTables);
router.post("/updateTrainingTable", updateTrainingTable);
router.post("/deleteTrainingTable", deleteTrainingTable);

// Meals Management
router.post("/insertMealToTable", insertMealToTable);
router.post("/getMealsByTableId", getMealsByTableId);
router.post("/getAllMealsWithTables", getAllMealsWithTables);
router.post("/updateMealInTable", updateMealInTable);
router.post("/deleteMealFromTable", deleteMealFromTable);

// ========================================
// Old Routes (Backward Compatibility)
// ========================================
router.post("/insertDataReadyTable", insertDataReadyTable);
router.post("/getDataReadyTables", getDataReadyTables);
router.post("/updateDataReadyTable", updateDataReadyTable);
router.post("/deleteDataReadyTable", deleteDataReadyTable);

module.exports = router;
