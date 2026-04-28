const mongoose = require('mongoose');

const pensionPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, default: 0 },
  year: { type: String },
  month: { type: String },
  bws: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  period: { type: String, enum: ['monthly', 'yearly'], default: 'yearly' },
}, { timestamps: true });

module.exports = mongoose.model('PensionPlan', pensionPlanSchema);