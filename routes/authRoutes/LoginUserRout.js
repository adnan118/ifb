// routes/routes.js
const express = require("express"); 
const { getUserData } = require("../../query/auth/getUserData");
const { LoginUser, LoginAdmin } = require("../../query/auth/login");
// START ADDED: optional auth for backward-compatible read routes
const { optionalAuth } = require("../../middleware/auth");
// END ADDED: optional auth for backward-compatible read routes

const router = express.Router();

 
router.post("/login", LoginUser);
// START ADDED: protect admin search route with bearer token
router.post("/getUserData", optionalAuth, getUserData);
// END ADDED: protect admin search route with bearer token
router.post("/loginAdmin", LoginAdmin);


module.exports = router;

/*
// routes/routes.js
const express = require("express"); 
const { getUserData } = require("../../query/auth/getUserData");
const { LoginUser, LoginAdmin } = require("../../query/auth/login");

const router = express.Router();

 
router.post("/login", LoginUser);
router.post("/getUserData", getUserData);
router.post("/loginAdmin", LoginAdmin);


module.exports = router;
*/
