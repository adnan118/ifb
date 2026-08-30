
const express = require("express");
// START ADDED: admin-only protection for training management routes
const { requireAdmin } = require("../../middleware/auth");
// END ADDED: admin-only protection for training management routes

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
const {
  insertTrainingPhaseExercise,
  updateTrainingPhaseExercise,
  deleteTrainingPhaseExercise,
  getTrainingPhaseExerciseLibrary,
  assignTrainingPhaseExercise,
  unassignTrainingPhaseExercise,
  getTrainingPhaseExercises,
  uploadTrainingPhaseFiles,
} = require("../../query/training_phase_exercises/trainingPhaseExercises");

const { insertDataUserTraining } = require("../../query/user_trainings/insertDataUserTraining");
const { updateDataUserTraining } = require("../../query/user_trainings/updateDataUserTraining");
const { deleteDataUserTraining } = require("../../query/user_trainings/deleteDataUserTraining");
const { getDataUserTrainingsByUserId } = require("../../query/user_trainings/getDataUserTraining");

const router = express.Router();

// START ADDED: protect training write routes with bearer token
router.post("/insertDataTraining", requireAdmin, uploadImages, insertDataTraining);
router.post("/updateDataTraining", requireAdmin, uploadImages, updateDataTraining);
// END ADDED: protect training write routes with bearer token
router.post("/getTrainingsByActivityId", getTrainingsByActivityId);

router.post("/getDataTraining", getDataTraining);
// START ADDED: protect training write routes with bearer token
router.post("/deleteDataTraining", requireAdmin, deleteDataTraining, deleteImages);
router.post("/updateAvailabilityTraining", requireAdmin, updateAvailabilityTraining);
// END ADDED: protect training write routes with bearer token

// START ADDED: protect user training write routes with bearer token
router.post("/insertUserTraining", requireAdmin, insertDataUserTraining);
router.post("/updateUserTraining", requireAdmin, updateDataUserTraining);
router.post("/deleteUserTraining", requireAdmin, deleteDataUserTraining);
// END ADDED: protect user training write routes with bearer token
router.post("/getUserTrainings", getDataUserTrainingsByUserId);

// Reusable warmup/cooldown library. Exercises are created once, then assigned
// to any number of trainings through the assignment endpoints.
router.post(
  "/insertTrainingPhaseExercise",
  requireAdmin,
  uploadTrainingPhaseFiles,
  insertTrainingPhaseExercise
);
router.post(
  "/updateTrainingPhaseExercise",
  requireAdmin,
  uploadTrainingPhaseFiles,
  updateTrainingPhaseExercise
);
router.post(
  "/deleteTrainingPhaseExercise",
  requireAdmin,
  deleteTrainingPhaseExercise
);
router.post(
  "/assignTrainingPhaseExercise",
  requireAdmin,
  assignTrainingPhaseExercise
);
router.post(
  "/unassignTrainingPhaseExercise",
  requireAdmin,
  unassignTrainingPhaseExercise
);
router.post(
  "/getTrainingPhaseExerciseLibrary",
  getTrainingPhaseExerciseLibrary
);
router.post("/getTrainingPhaseExercises", getTrainingPhaseExercises);

module.exports = router;

/*
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
*/



