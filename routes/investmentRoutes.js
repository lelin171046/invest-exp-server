const express = require("express");
const router = express.Router();

const { createInvestment, getInvestments, updateInvestment, deleteInvestment } = require("../controllers/investmentController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createInvestment);
router.get("/", verifyToken, getInvestments);
router.put("/:id", verifyToken, updateInvestment);
router.delete("/:id", verifyToken, deleteInvestment);

module.exports = router;