// routes/authRoutes/DeleteUserRout.js
const express = require("express");
const { deleteUser, deleteUserById } = require("../../query/auth/deleteUser");

const router = express.Router();

// مسار لحذف المستخدم باستخدام رقم الهاتف
router.post("/deleteUser", deleteUser);

// مسار لحذف المستخدم باستخدام ID
router.post("/deleteUserById", deleteUserById);

module.exports = router;
