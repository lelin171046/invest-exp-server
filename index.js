const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

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

app.use('/users', userRoutes);

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