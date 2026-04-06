// routes/routes.js
const express = require("express");
const { getUserData, getAllUsers } = require("../../query/auth/getUserData");
// START ADDED: admin-only protection for sensitive user routes
const { requireAdmin, requireAuth } = require("../../middleware/auth");
// END ADDED: admin-only protection for sensitive user routes

const router = express.Router();

// START ADDED: protect admin routes with bearer token
router.post("/getUserData", requireAuth, getUserData);
router.post("/getAllUsers", requireAdmin, getAllUsers);
// END ADDED: protect admin routes with bearer token

module.exports = router;

/*
// routes/routes.js
const express = require("express");
const { getUserData, getAllUsers } = require("../../query/auth/getUserData");

const router = express.Router();

router.post("/getUserData", getUserData);
router.post("/getAllUsers", getAllUsers);

module.exports = router;
*/
