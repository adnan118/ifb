// routes/routes.js
const express = require("express");
const { FgPassword } = require("../../query/auth/fgpassword");
const { updatePassword } = require("../../query/auth/updatePassword");

const router = express.Router();

router.post("/fgpassword", FgPassword);     
router.post("/updatePassword", updatePassword);     

module.exports = router;

  
