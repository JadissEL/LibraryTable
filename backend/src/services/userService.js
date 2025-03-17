import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class UserService {
  static async createUser(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = new User({
      ...userData,
      password: hashedPassword
    });

    return await user.save();
  }

  static async authenticateUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    const userObject = user.toObject();
    delete userObject.password;
    
    return { token, user: userObject };
  }

  static async getUserById(id) {
    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  static async updateUser(id, updateData) {
    delete updateData.role;

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    return await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
  }

  static async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  static async getAllUsers() {
    return await User.find({}).select('-password');
  }
}

export default UserService;
