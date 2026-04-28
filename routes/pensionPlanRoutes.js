const express = require("express");
const router = express.Router();

const { createPensionPlan, getPensionPlans, updatePensionPlan, deletePensionPlan } = require("../controllers/pensionPlanController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createPensionPlan);
router.get("/", verifyToken, getPensionPlans);
router.put("/:id", verifyToken, updatePensionPlan);
router.delete("/:id", verifyToken, deletePensionPlan);

module.exports = router;