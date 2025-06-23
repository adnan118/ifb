// routes/routes.js
const express = require("express");
 

const {
  updateUserData,
  uploadImages,
} = require("../../query/auth/updateProfile");

const router = express.Router();

router.post("/updateProfile", uploadImages, updateUserData);

module.exports = router;
