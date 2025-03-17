import BookingService from '../services/bookingService.js';

class BookingController {
  static async createBooking(req, res) {
    try {
      const bookingData = {
        ...req.body,
        user: req.user.id
      };

      const booking = await BookingService.createBooking(bookingData);
      res.status(201).json({
        success: true,
        data: booking
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getBookingById(req, res) {
    try {
      const booking = await BookingService.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      if (!req.user.isAdmin && booking.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this booking'
        });
      }

      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getUserBookings(req, res) {
    try {
      const bookings = await BookingService.getUserBookings(req.user.id);
      res.status(200).json({
        success: true,
        data: bookings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving bookings'
      });
    }
  }

  static async updateBookingStatus(req, res) {
    try {
      const { status } = req.body;

      const booking = await BookingService.updateBookingStatus(req.params.id, status);
      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async cancelBooking(req, res) {
    try {
      const booking = await BookingService.getBookingById(req.params.id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      if (!req.user.isAdmin && booking.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to cancel this booking'
        });
      }

      await BookingService.cancelBooking(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }


  static async getAllBookings(req, res) {
    try {
      const bookings = await BookingService.getAllBookings();
      res.status(200).json({
        success: true,
        data: bookings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving all bookings'
      });
    }
  }
}

export default BookingController;
