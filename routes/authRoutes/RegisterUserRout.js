// routes/routes.js
const express = require("express");
const { RegisterUser } = require("../../query/auth/register");

const router = express.Router();

 
router.post("/register", RegisterUser);

module.exports = router;