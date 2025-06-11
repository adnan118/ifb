const express = require('express');
  
 const {
   
   insertEquipmentData, uploadImages
 } = require("../../query/equipments/insertDataEquipments");
 const {
   updateEquipmentData,
 } = require("../../query/equipments/updateDataEquipments");
 
 const {
   getAllEquipments,
 } = require("../../query/equipments/getDataEquipments");
 const {
   deleteEquipment, 
 } = require("../../query/equipments/deleteDataEquipments");
 
 
 const router = express.Router();
 
 router.post("/insertEquipmentData", uploadImages, insertEquipmentData);
 router.post("/updateEquipmentData", uploadImages, updateEquipmentData);
 
 
 router.post("/getAllEquipments", getAllEquipments);
 router.post("/deleteEquipment", deleteEquipment);
  
 

 
module.exports = router; 