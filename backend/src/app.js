import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';

import userRoutes from './routes/userRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(process.env.MONGO_URI, mongoOptions)
  .then(() => {
    console.log('Connected to MongoDB at:', process.env.MONGO_URI);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
});

mongoose.set('strictQuery', true);

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Library Booking System API',
    version: '1.0.0'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({
      success: false,
      message: err.message
    });
  } else {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


export default app;
