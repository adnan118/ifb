const express = require("express");
const {  insertDataFood,  uploadImages,} = require("../../query/food/insertDataFood"); 
const { updateDataFood } = require("../../query/food/updateDataFood"); 
const { getDataFood } = require("../../query/food/getDataFood"); 
const { deleteDataFood } = require("../../query/food/deleteDataFood"); 


const router = express.Router();

router.post("/insertDataFood",uploadImages, insertDataFood);
router.post("/updateDataFood", uploadImages, updateDataFood);


router.post("/getDataFood", getDataFood);
router.post("/deleteDataFood", deleteDataFood);



module.exports = router;
