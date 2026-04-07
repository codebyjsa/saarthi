const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const queueRoutes = require('./routes/queue');
const doctorRoutes = require('./routes/doctors');
const User = require('./models/User');
const socketHandlers = require('./socket/handlers');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Seed Users Function
const seedUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding demo users...');
      const users = [
        { username: 'patient1', password: 'pass123', name: 'Ayush Sharma', role: 'patient' },
        { username: 'doctor1', password: 'pass123', name: 'Dr. Sameer Khan', role: 'doctor' },
        { username: 'admin1', password: 'pass123', name: 'Hospital Admin', role: 'admin' },
      ];
      await User.insertMany(users);
      console.log('Demo users seeded successfully!');
    }
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

// Register Socket.io Handlers
socketHandlers(io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/doctors', doctorRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Saarthi Server is running healthy' });
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/saarthi';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedUsers();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
