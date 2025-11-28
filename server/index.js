const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placement-prep');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
  res.json({ message: 'Placement Prep API Server' });
});

const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interviews');
const testRoutes = require('./routes/tests');

app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/tests', testRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
