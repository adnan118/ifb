const express = require("express");
// START ADDED: admin-only protection for food management routes
const { requireAdmin } = require("../../middleware/auth");
// END ADDED: admin-only protection for food management routes
const {  insertDataFood,  uploadImages,} = require("../../query/food/insertDataFood"); 
const { updateDataFood } = require("../../query/food/updateDataFood"); 
const { getDataFood } = require("../../query/food/getDataFood"); 
const { deleteDataFood } = require("../../query/food/deleteDataFood"); 
const { getAllFood } = require("../../query/food/getAllDataFood"); 

// استيراد وظائف user_foods
 
const { insertDataUserFood } = require("../../query/user_foods/insertDataUserFood");
const { updateDataUserFood } = require("../../query/user_foods/updateDataUserFood");
const { deleteDataUserFood } = require("../../query/user_foods/deleteDataUserFood");
const { getDataUserFoodsByUserId } = require("../../query/user_foods/getDataUserFood"); 



const router = express.Router();

// START ADDED: protect food write routes with bearer token
router.post("/insertDataFood", requireAdmin, uploadImages, insertDataFood);
router.post("/updateDataFood", requireAdmin, uploadImages, updateDataFood);
// END ADDED: protect food write routes with bearer token


router.post("/getDataFood", getDataFood);
// START ADDED: protect food delete route with bearer token
router.post("/deleteDataFood", requireAdmin, deleteDataFood);
// END ADDED: protect food delete route with bearer token
router.post("/getAllFood", getAllFood);


// روابط user_foods
// START ADDED: protect user food write routes with bearer token
router.post("/insertUserFood", requireAdmin, insertDataUserFood);
router.post("/updateUserFood", requireAdmin, updateDataUserFood);
router.post("/deleteUserFood", requireAdmin, deleteDataUserFood);
// END ADDED: protect user food write routes with bearer token
router.post("/getUserFoods", getDataUserFoodsByUserId);



module.exports = router;




/*
const express = require("express");
const {  insertDataFood,  uploadImages,} = require("../../query/food/insertDataFood"); 
const { updateDataFood } = require("../../query/food/updateDataFood"); 
const { getDataFood } = require("../../query/food/getDataFood"); 
const { deleteDataFood } = require("../../query/food/deleteDataFood"); 
const { getAllFood } = require("../../query/food/getAllDataFood"); 

// استيراد وظائف user_foods
 
const { insertDataUserFood } = require("../../query/user_foods/insertDataUserFood");
const { updateDataUserFood } = require("../../query/user_foods/updateDataUserFood");
const { deleteDataUserFood } = require("../../query/user_foods/deleteDataUserFood");
const { getDataUserFoodsByUserId } = require("../../query/user_foods/getDataUserFood"); 



const router = express.Router();

router.post("/insertDataFood",uploadImages, insertDataFood);
router.post("/updateDataFood", uploadImages, updateDataFood);


router.post("/getDataFood", getDataFood);
router.post("/deleteDataFood", deleteDataFood);
router.post("/getAllFood", getAllFood);


// روابط user_foods
router.post("/insertUserFood", insertDataUserFood);
router.post("/updateUserFood", updateDataUserFood);
router.post("/deleteUserFood", deleteDataUserFood);
router.post("/getUserFoods", getDataUserFoodsByUserId);



module.exports = router;



*/
