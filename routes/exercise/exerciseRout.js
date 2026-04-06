const express = require('express');
// START ADDED: admin-only protection for exercise management routes
const { requireAdmin } = require("../../middleware/auth");
// END ADDED: admin-only protection for exercise management routes
  
const {
  insertDataExercise,
  uploadFiles
} = require("../../query/exercise/insertDataExercise");
 
const {
  updateDataExercise,
  uploadFiles: updateUploadFiles
} = require("../../query/exercise/updateDataExercise");
 
const { getDataExercise } = require("../../query/exercise/getDataExercise");
const { deleteDataExercise } = require("../../query/exercise/deleteDataExercise");
 
const router = express.Router();
 
router.post(
  "/insertDataExercise",
  requireAdmin,
  uploadFiles,
  insertDataExercise
);

router.post(
  "/updateDataExercise",
  requireAdmin,
  updateUploadFiles,
  updateDataExercise
);
 
router.post("/getDataExercise", getDataExercise);

router.post(
  "/deleteDataExercise",
  requireAdmin,
  deleteDataExercise
);
 
module.exports = router; 

/*
const express = require('express');
  
const {
  insertDataExercise,
  uploadFiles
} = require("../../query/exercise/insertDataExercise");
 
const {
  updateDataExercise,
  uploadFiles: updateUploadFiles
} = require("../../query/exercise/updateDataExercise");
 
const { getDataExercise } = require("../../query/exercise/getDataExercise");
const { deleteDataExercise } = require("../../query/exercise/deleteDataExercise");
 
const router = express.Router();
 
router.post(
  "/insertDataExercise",
  uploadFiles,
  insertDataExercise
);

router.post(
  "/updateDataExercise",
  updateUploadFiles,
  updateDataExercise
);
 
router.post("/getDataExercise", getDataExercise);

router.post(
  "/deleteDataExercise",

  deleteDataExercise
);
 
module.exports = router; 
*/
