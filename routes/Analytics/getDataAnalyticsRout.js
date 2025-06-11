// routes/routes.js
const express = require("express");
const { getDataSteps } = require("../../query/Analytics/steps/getDataSteps");
const {  updateOrInsertSteps} = require("../../query/Analytics/steps/updateOrInsertSteps");
const { getDataSleep } = require("../../query/Analytics/sleep/getDataSleep");
const {  updateOrInsertSleep} = require("../../query/Analytics/sleep/updateOrInsertSleep");



const {  getDataWorkouttime} = require("../../query/Analytics/workout/getDataWorkouttime");
const {
  updateOrInsertWorkoutTime,
} = require("../../query/Analytics/workout/updateOrInsertWorkoutTime");


const {
  updateOrInsertMealCalories,
} = require("../../query/Analytics/mealcalories/updateOrInsertMealCalories");
const {
  getDataMealcalories,
} = require("../../query/Analytics/mealcalories/getDataMealcalories");


const {
  getDataTrackingWeight,
} = require("../../query/Analytics/trackingWeight/getDataTrackingWeight");
const {
  updateOrInsertTrackingWeight,
} = require("../../query/Analytics/trackingWeight/updateOrInsertTrackingWeight");

 



const router = express.Router();

router.post("/getDataSteps", getDataSteps);
router.post("/updateOrInsertSteps", updateOrInsertSteps);


router.post("/getDataSleep", getDataSleep);
router.post("/updateOrInsertSleep", updateOrInsertSleep);


router.post("/getDataWorkouttime", getDataWorkouttime);
router.post("/updateOrInsertWorkoutTime", updateOrInsertWorkoutTime);


router.post("/getDataMealcalories", getDataMealcalories);
router.post("/updateOrInsertMealCalories", updateOrInsertMealCalories);


router.post("/getDataTrackingWeight", getDataTrackingWeight);
router.post("/updateOrInsertTrackingWeight", updateOrInsertTrackingWeight);
 


module.exports = router;
