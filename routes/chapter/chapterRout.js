const express = require('express');
const {  uploadImages,  insertDataChapter, } = require("../../query/chapter/insertDataChapter");
const { updateDataChapter } = require("../../query/chapter/updateDataChapter");


const { getDataChapters } = require("../../query/chapter/getDataChapter");
const { deleteDataChapter } = require("../../query/chapter/deleteDataChapter"); 


const router = express.Router();
router.post("/insertDataChapter", uploadImages, insertDataChapter);
router.post("/updateDataChapter", uploadImages, updateDataChapter);


router.post("/getDataChapters", getDataChapters);
router.post("/deleteDataChapter", deleteDataChapter);

 
module.exports = router; 