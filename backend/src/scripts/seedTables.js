const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
});
const mongoose = require('mongoose');
const Table = require('../models/Table');

console.log('Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI);

const sampleTables = [
  {
    tableNumber: "A1",
    capacity: 4,
    location: "Main Floor",
    features: ["power_outlet", "window_view"],
    isAvailable: true
  },
  {
    tableNumber: "B1",
    capacity: 6,
    location: "Main Floor",
    features: ["power_outlet", "group_study"],
    isAvailable: true
  },
  {
    tableNumber: "C1",
    capacity: 2,
    location: "Second Floor",
    features: ["quiet_zone"],
    isAvailable: true
  },
  {
    tableNumber: "D1",
    capacity: 8,
    location: "Second Floor",
    features: ["power_outlet", "group_study"],
    isAvailable: true
  }
];

const seedTables = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    await Table.deleteMany({});
    console.log('Cleared existing tables');

    const tables = await Table.insertMany(sampleTables);
    console.log('Sample tables inserted:', tables);

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error seeding tables:', error);
    process.exit(1);
  }
};

seedTables();
