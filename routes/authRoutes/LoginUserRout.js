// routes/routes.js
const express = require("express"); 
const { getUserData } = require("../../query/auth/getUserData");
const { LoginUser, LoginAdmin } = require("../../query/auth/login");

const router = express.Router();

 
router.post("/login", LoginUser);
router.post("/getUserData", getUserData);
router.post("/loginAdmin", LoginAdmin);


module.exports = router;
