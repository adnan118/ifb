// routes/routes.js
const express = require("express");
const { requireAuth } = require("../../middleware/auth");
 

const {
  updateUserData,
  uploadImages,
} = require("../../query/auth/updateProfile");

const router = express.Router();

router.post("/updateProfile", requireAuth, uploadImages, updateUserData);

module.exports = router;
