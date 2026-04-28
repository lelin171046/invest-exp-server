const express = require("express");
const router = express.Router();

const { createForecast, getForecasts, updateForecast, deleteForecast } = require("../controllers/forecastController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, createForecast);
router.get("/", verifyToken, getForecasts);
router.put("/:id", verifyToken, updateForecast);
router.delete("/:id", verifyToken, deleteForecast);

module.exports = router;