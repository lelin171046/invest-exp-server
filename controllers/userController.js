const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateUserId = require("../utils/generateUserId");

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, adminKey } = req.body;
    console.log("Creating user with data:", { name, email });

    if (!name || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const userId = await generateUserId();
    const hashedPassword = await bcrypt.hash(password, 10);

    let userRole = "user";
    
    if (req.user && req.user.role === "admin" && role) {
      userRole = role;
    } else if (adminKey === process.env.ADMIN_CREATE_KEY) {
      userRole = role || "user";
    }

    const newUser = await User.create({
      userId,
      email,
      name,
      password: hashedPassword,
      role: userRole,
      createdBy: req.user?.id,
    });

    res.status(201).json({
      message: "User created",
      userId: newUser.userId,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "identifier and password are required" });
    }

    const user = await User.findOne({
      $or: [{ userId: identifier }, { email: identifier }]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = require('jsonwebtoken').sign(
      { id: user._id, userId: user.userId, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: "userId and role are required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User role updated",
      userId: updatedUser.userId,
      name: updatedUser.name,
      role: updatedUser.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createUser, loginUser, updateUserRole };