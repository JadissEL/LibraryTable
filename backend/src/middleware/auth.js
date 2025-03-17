import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, message: 'No authentication token found' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ success: false, message: 'JWT secret is not defined' });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};

export default auth;
