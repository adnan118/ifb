// routes/routes.js
const express = require("express");
const {
  updateUserProfile,
  uploadUserImage,
} = require("../../query/auth/updateProfile");

const router = express.Router();

router.post("/updateProfile", uploadUserImage, updateUserProfile);

module.exports = router;
 