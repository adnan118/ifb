const express = require('express');
  
 const {
   insertDataTrainingCategory,   uploadImages, } = require("../../query/trainingCategory/insertDataTrainingCategory"); 
 const {
   updateDataTrainingCategory,
 } = require("../../query/trainingCategory/updateDataTrainingCategory");
 const {
   getTrainingCategories,
 } = require("../../query/trainingCategory/getDataTrainingCategory");
 const {
   deleteDataTrainingCategory,
   deleteImages,
 } = require("../../query/trainingCategory/deleteDataTrainingCategory");
 
 
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