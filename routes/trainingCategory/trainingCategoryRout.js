const express = require('express');
  
 const {
   insertDataTrainingCategory,
   uploadImages,
 } = require("../../query/training_category/insertDataTrainingCategory"); 
 const {
   updateDataTrainingCategory,
 } = require("../../query/training_category/updateDataTrainingCategory");
 const {
   getTrainingCategories,
 } = require("../../query/training_category/getDataTrainingCategory");
 const {
   deleteDataTrainingCategory,
   deleteImages,
 } = require("../../query/training_category/deleteDataTrainingCategory");
 
 
 const router = express.Router();
 
 router.post(   "/insertDataTrainingCategory",   uploadImages,   insertDataTrainingCategory );
 router.post(   "/updateDataTrainingCategory",   uploadImages,   updateDataTrainingCategory );
 
 
router.post("/getDataTrainingCategory", getTrainingCategories);
 
router.post(
  "/deleteDataTrainingCategory",
  deleteDataTrainingCategory,
  deleteImages
);
  
 
  
module.exports = router; 
