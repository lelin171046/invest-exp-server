const Investment = require("../models/Investment");

const createInvestment = async (req, res) => {
  try {
    const { name, amount, type, startDate, expectedReturn, notes } = req.body;

    if (!name || !amount || !type) {
      return res.status(400).json({ message: "Name, amount, and type are required" });
    }

    const investment = await Investment.create({
      userId: req.user.userId,
      name,
      amount,
      type,
      startDate,
      expectedReturn,
      notes,
    });

    res.status(201).json({
      message: "Investment created",
      investment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, amount, type, startDate, expectedReturn, status, notes } = req.body;

    const investment = await Investment.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { name, amount, type, startDate, expectedReturn, status, notes },
      { new: true }
    );

    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.json({ message: "Investment updated", investment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteInvestment = async (req, res) => {
  try {
    const { id } = req.params;

    const investment = await Investment.findOneAndDelete({ _id: id, userId: req.user.userId });

    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.json({ message: "Investment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createInvestment, getInvestments, updateInvestment, deleteInvestment };