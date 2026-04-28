const mongoose = require('mongoose');

const forecastSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  clientName: { type: String, required: true },
  advisingOn: { type: String },
  expectedRevenue: { type: Number, default: 0 },
  actualRevenue: { type: Number, default: 0 },
  year: { type: String },
  month: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Forecast', forecastSchema);