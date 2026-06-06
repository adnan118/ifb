

const express = require("express");
const { optionalAuth } = require("../../middleware/auth");

const {
  GetProfile,
} = require("../../query/profile/getProfile");

const router = express.Router();

router.post("/GetProfile", optionalAuth, GetProfile);
module.exports = router;

/*
const express = require("express");
 
const {
  GetProfile,
} = require("../../query/profile/getProfile");

const router = express.Router();
 
router.post("/GetProfile", GetProfile);
module.exports = router;
*/
