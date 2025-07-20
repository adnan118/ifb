// routes/routes.js
const express = require("express");
const { getUserData } = require("../../query/auth/getUserData");

const router = express.Router();

router.post("/getUserData", getUserData);

module.exports = router;
