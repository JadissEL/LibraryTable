import UserService from '../services/userService.js';
import jwt from 'jsonwebtoken';

class UserController {
  static async register(req, res) {
    try {
      const user = await UserService.createUser(req.body);

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-default-secret-key',
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      res.status(201).json({
        success: true,
        data: { token, user }
      });
    } catch (error) {
      const statusCode = error.message === 'User with this email already exists' ? 409 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Internal Server Error'
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserService.authenticateUser(email, password);

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-default-secret-key',
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      res.status(200).json({
        success: true,
        data: { token }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || 'Unauthorized'
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await UserService.getUserById(req.user.id);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const user = await UserService.updateUser(req.user.id, req.body);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving users'
      });
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default UserController;
