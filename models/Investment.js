const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  startDate: { type: Date },
  expectedReturn: { type: Number },
  status: { type: String, default: 'active' },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Investment', investmentSchema);