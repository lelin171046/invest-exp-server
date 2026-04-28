const PensionPlan = require("../models/PensionPlan");
const mongoose = require('mongoose');

const createPensionPlan = async (req, res) => {
  try {
    const { name, amount, year, month, bws, commission, period } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const pensionPlan = await PensionPlan.create({
      userId: req.user.userId,
      name,
      amount: amount || 0,
      year,
      month,
      bws: bws || 0,
      commission: commission || 0,
      period: period || 'yearly',
    });

    res.status(201).json({
      message: "Pension plan created",
      pensionPlan,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPensionPlans = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'admin') {
      if (req.query.userId) {
        query.userId = req.query.userId;
      }
    } else {
      query.userId = req.user.userId;
    }

    if (req.query.period) {
      query.period = req.query.period;
    }

    const pensionPlans = await PensionPlan.find(query).sort({ createdAt: -1 });
    
    let filtered = pensionPlans;
    
    if (req.query.year || req.query.month) {
      filtered = pensionPlans.filter(plan => {
        const created = new Date(plan.createdAt);
        const planYear = created.getFullYear().toString();
        const planMonth = (created.getMonth() + 1).toString();
        
        if (req.query.year && req.query.year !== planYear) return false;
        if (req.query.month && req.query.month !== planMonth) return false;
        return true;
      });
    }
    
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePensionPlan = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan ID" });
    }

    const { name, amount, year, month, bws, commission, period } = req.body;

    const query = req.user.role === 'admin' 
      ? { _id: id } 
      : { _id: id, userId: req.user.userId };

    const pensionPlan = await PensionPlan.findOneAndUpdate(
      query,
      { name, amount, year, month, bws, commission, period },
      { new: true }
    );

    if (!pensionPlan) {
      return res.status(404).json({ message: "Pension plan not found" });
    }

    res.json({ message: "Pension plan updated", pensionPlan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deletePensionPlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan ID" });
    }

    const query = req.user.role === 'admin' 
      ? { _id: id } 
      : { _id: id, userId: req.user.userId };

    const pensionPlan = await PensionPlan.findOneAndDelete(query);

    if (!pensionPlan) {
      return res.status(404).json({ message: "Pension plan not found" });
    }

    res.json({ message: "Pension plan deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPensionPlan, getPensionPlans, updatePensionPlan, deletePensionPlan };