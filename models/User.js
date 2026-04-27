const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  email: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);