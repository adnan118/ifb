// routes/routes.js
const express = require("express");
const { FgPassword } = require("../../query/auth/fgpassword");

const router = express.Router();

router.post("/fgpassword", FgPassword);

module.exports = router;
