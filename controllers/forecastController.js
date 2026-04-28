const Forecast = require("../models/Forecast");
const mongoose = require('mongoose');

const createForecast = async (req, res) => {
  try {
    const { clientName, advisingOn, expectedRevenue, actualRevenue, year, month } = req.body;

    if (!clientName) {
      return res.status(400).json({ message: "Client name is required" });
    }

    const forecast = await Forecast.create({
      userId: req.user.userId,
      clientName,
      advisingOn,
      expectedRevenue: expectedRevenue || 0,
      actualRevenue: actualRevenue || 0,
      year,
      month,
    });

    res.status(201).json({
      message: "Forecast created",
      forecast,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getForecasts = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'admin') {
      if (req.query.userId) {
        query.userId = req.query.userId;
      }
    } else {
      query.userId = req.user.userId;
    }

    const forecasts = await Forecast.find(query).sort({ createdAt: -1 });
    
    let filtered = forecasts;
    
    if (req.query.year || req.query.month) {
      filtered = forecasts.filter(forecast => {
        const created = new Date(forecast.createdAt);
        const forecastYear = created.getFullYear().toString();
        const forecastMonth = (created.getMonth() + 1).toString();
        
        if (req.query.year && req.query.year !== forecastYear) return false;
        if (req.query.month && req.query.month !== forecastMonth) return false;
        return true;
      });
    }
    
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateForecast = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid forecast ID" });
    }

    const { clientName, advisingOn, expectedRevenue, actualRevenue, year, month } = req.body;

    const query = req.user.role === 'admin' 
      ? { _id: id } 
      : { _id: id, userId: req.user.userId };

    const forecast = await Forecast.findOneAndUpdate(
      query,
      { clientName, advisingOn, expectedRevenue, actualRevenue, year, month },
      { new: true }
    );

    if (!forecast) {
      return res.status(404).json({ message: "Forecast not found" });
    }

    res.json({ message: "Forecast updated", forecast });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteForecast = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid forecast ID" });
    }

    const query = req.user.role === 'admin' 
      ? { _id: id } 
      : { _id: id, userId: req.user.userId };

    const forecast = await Forecast.findOneAndDelete(query);

    if (!forecast) {
      return res.status(404).json({ message: "Forecast not found" });
    }

    res.json({ message: "Forecast deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createForecast, getForecasts, updateForecast, deleteForecast };