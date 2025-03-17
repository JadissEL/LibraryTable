const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
});
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      await mongoose.connection.close();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user'
    });

    const savedUser = await testUser.save();
    console.log('Test user created:', savedUser);

    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
      const adminHashedPassword = await bcrypt.hash('AdminPass123!', salt);
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminHashedPassword,
        role: 'admin'
      });

      const savedAdmin = await adminUser.save();
      console.log('Admin user created:', savedAdmin);
    }

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
