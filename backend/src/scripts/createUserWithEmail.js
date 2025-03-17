const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
});
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const email = 'elantaki.dijadiss@gmail.com';
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User with this email already exists');
      await mongoose.connection.close();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    const user = new User({
      name: 'Dijadiss Elantaki',
      email: email,
      password: hashedPassword,
      role: 'admin'
    });

    const savedUser = await user.save();
    console.log('User created:', savedUser);

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
};

createUser();
