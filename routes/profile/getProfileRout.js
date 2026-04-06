

const express = require("express");
const { requireAuth } = require("../../middleware/auth");

const {
  GetProfile,
} = require("../../query/profile/getProfile");

const router = express.Router();

router.post("/GetProfile", requireAuth, GetProfile);
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
