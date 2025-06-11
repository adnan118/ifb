const express = require('express');
const {
  
  insertDataMeal,
} = require("../../query/mealFood/insertDataMeal");
const { updateDataMeal } = require("../../query/mealFood/updateDataMeal");


const { getDataMeal } = require("../../query/mealFood/getDataMeal");
const { deleteDataMeal } = require("../../query/mealFood/deleteDataMeal"); 


const router = express.Router();
router.post("/insertDataMeal",  insertDataMeal);
router.post("/updateDataMeal",  updateDataMeal);


router.post("/getDataMeal", getDataMeal);
router.post("/deleteDataMeal", deleteDataMeal);

 
module.exports = router; 