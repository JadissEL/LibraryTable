import { Router } from 'express';
const router = Router();
import BookingController from '../controllers/bookingController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

router.post('/', auth, BookingController.createBooking);
router.get('/my-bookings', auth, BookingController.getUserBookings);
router.get('/:id', auth, BookingController.getBookingById);
router.delete('/:id/cancel', auth, BookingController.cancelBooking);

router.put('/:id/status', auth, admin, BookingController.updateBookingStatus);

router.get('/', auth, admin, BookingController.getAllBookings);

export default router;
