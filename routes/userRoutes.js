const express = require("express");
const router = express.Router();

const { createUser, loginUser, updateUserRole } = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

router.post("/", createUser);
router.post("/create", verifyToken, adminOnly, createUser);
router.post("/login", loginUser);
router.put("/:userId/role", verifyToken, adminOnly, updateUserRole);

module.exports = router;