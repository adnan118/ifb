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

 // استيراد وظائف user_trainings
 const { insertDataUserTraining } = require("../../query/user_trainings/insertDataUserTraining");
 const { updateDataUserTraining } = require("../../query/user_trainings/updateDataUserTraining");
 const { deleteDataUserTraining } = require("../../query/user_trainings/deleteDataUserTraining");
 const { getDataUserTrainingsByUserId } = require("../../query/user_trainings/getDataUserTraining");
 
 const router = express.Router();
 
 router.post("/insertDataTraining", uploadImages, insertDataTraining);
 router.post("/updateDataTraining", uploadImages, updateDataTraining);
 router.post("/getTrainingsByActivityId", getTrainingsByActivityId);

 
 router.post("/getDataTraining", getDataTraining);
 router.post("/deleteDataTraining", deleteDataTraining, deleteImages);
  router.post("/updateAvailabilityTraining", updateAvailabilityTraining);

 // روابط user_trainings
router.post("/insertUserTraining", insertDataUserTraining);
router.post("/updateUserTraining", updateDataUserTraining);
router.post("/deleteUserTraining", deleteDataUserTraining);
router.post("/getUserTrainings", getDataUserTrainingsByUserId);


 
module.exports = router; 




