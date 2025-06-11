// routes/routes.js
const express = require("express");
const { VerifyUser }       = require("../../query/auth/vfc");

const router = express.Router();

router.post("/vfc", VerifyUser);

module.exports = router;
