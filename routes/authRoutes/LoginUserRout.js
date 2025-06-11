// routes/routes.js
const express = require("express");
const { LoginUser } = require("../../query/auth/login");
const { getUserData } = require("../../query/auth/getUserData");

const router = express.Router();

 
router.post("/login", LoginUser);
router.post("/getUserData", getUserData);

module.exports = router;