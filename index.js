const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const app = express();

require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const investmentRoutes = require('./routes/investmentRoutes');
const pensionPlanRoutes = require('./routes/pensionPlanRoutes');
const forecastRoutes = require('./routes/forecastRoutes');

const port = process.env.PORT || 5000;

const corsOption = {
  origin: [
    'http://localhost:5173',
  ],
  methods: 'GET,POST,PUT,DELETE,PATCH',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

app.use('/users', userRoutes);
app.use('/investments', investmentRoutes);
app.use('/pension-plans', pensionPlanRoutes);
app.use('/forecasts', forecastRoutes);

app.get('/users/list', verifyToken, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.use((req, res, next) => {
  next();
});

app.get('/', (req, res) => {
  res.send('server running ok');
});

const uri = `mongodb://localhost:27017/`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await mongoose.connect('mongodb://localhost:27017/invest-exp');
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error('Database connection error:', err);
  }
}
run().catch(console.dir);

app.listen(port, () => console.log(`Server running on port: ${port}`));