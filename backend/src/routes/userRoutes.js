import { Router } from 'express';
const router = Router();
import UserController from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.get('/profile', auth, UserController.getProfile);
router.put('/profile', auth, UserController.updateProfile);

router.get('/', auth, admin, UserController.getAllUsers);
router.delete('/:id', auth, admin, UserController.deleteUser);

export default router;
