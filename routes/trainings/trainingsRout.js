const express = require('express');
  
 const {
   insertDataTraining,
   uploadImages,
 } = require("../../query/trainings/insertDataTraining");
 const {
   updateDataTraining,
 } = require("../../query/trainings/updateDataTraining");
 const { getDataTraining } = require("../../query/trainings/getDataTraining");
 const {
   deleteDataTraining,
   deleteImages,
 } = require("../../query/trainings/deleteDataTraining");
 
   const {
    updateAvailabilityTraining,
  } = require("../../query/trainings/updateAvailabilityTraining");
 const { getTrainingsByActivityId } = require("../../query/trainings/getTrainingsByActivityId");

 const router = express.Router();
 
 router.post("/insertDataTraining", uploadImages, insertDataTraining);
 router.post("/updateDataTraining", uploadImages, updateDataTraining);
 router.post("/getTrainingsByActivityId", getTrainingsByActivityId);

 
 router.post("/getDataTraining", getDataTraining);
 router.post("/deleteDataTraining", deleteDataTraining, deleteImages);
  router.post("/updateAvailabilityTraining", updateAvailabilityTraining);

 

 
module.exports = router; 

