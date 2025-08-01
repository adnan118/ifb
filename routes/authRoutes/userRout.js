// routes/routes.js
const express = require("express");
const { getUserData, getAllUsers } = require("../../query/auth/getUserData");

const router = express.Router();

router.post("/getUserData", getUserData);
router.post("/getAllUsers", getAllUsers);

module.exports = router;
