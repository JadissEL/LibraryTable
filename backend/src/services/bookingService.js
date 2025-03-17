import Booking from '../models/Booking.js';
import Table from '../models/Table.js';

class BookingService {
  static async createBooking(bookingData) {
    const table = await Table.findById(bookingData.table);
    if (!table || !table.isAvailable) {
      throw new Error('Table not available');
    }

    const conflictingBooking = await Booking.findOne({
      table: bookingData.table,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startTime: { $lt: bookingData.endTime },
          endTime: { $gt: bookingData.startTime }
        }
      ]
    });

    if (conflictingBooking) {
      throw new Error('Table already booked for this time period');
    }

    const booking = new Booking(bookingData);
    await booking.save();

    try {
      await Table.findByIdAndUpdate(bookingData.table, { isAvailable: false });

      return booking;
    } catch (error) {
      await Booking.findByIdAndDelete(booking._id);
      throw new Error('Failed to update table availability. Booking cancelled.');
    }
  }


  static async getBookingById(id) {
    return await Booking.findById(id)
      .populate('user', 'name email')
      .populate('table', 'tableNumber location');
  }

  static async getUserBookings(userId) {
    return await Booking.find({ user: userId })
      .populate('table', 'tableNumber location')
      .sort({ startTime: -1 });
  }

  static async updateBookingStatus(id, status) {
    const booking = await Booking.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    booking.status = status;
    
    if (status === 'cancelled' || status === 'completed') {
      const table = await Table.findById(booking.table);
      if (table) {
        table.isAvailable = true;
        await table.save();
      }
    }

    return await booking.save();
  }

  static async getAllBookings() {
    return await Booking.find()
      .populate('user', 'name email')
      .populate('table', 'tableNumber location')
      .sort({ startTime: -1 });
  }
}

export default BookingService;
