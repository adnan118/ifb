
const express = require("express");
 
const {
  GetProfile,
} = require("../../query/profile/getProfile");

const router = express.Router();
 
router.post("/GetProfile", GetProfile);
module.exports = router;