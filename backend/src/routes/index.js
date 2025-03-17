import { Router } from 'express';
import userRoutes from './userRoutes.js';
import tableRoutes from './tableRoutes.js';
import bookingRoutes from './bookingRoutes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/tables', tableRoutes);
router.use('/bookings', bookingRoutes);

export default router;
