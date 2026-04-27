const User = require('../models/User');

const generateUserId = async () => {
  const year = new Date().getFullYear();
  const count = await User.countDocuments();
  const padded = String(count + 1).padStart(3, '0');
  return `USR-${year}-${padded}`;  // e.g. USR-2026-007
};

module.exports = generateUserId;