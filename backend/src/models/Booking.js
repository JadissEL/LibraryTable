import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  purpose: {
    type: String,
    required: true
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1,
    max: 12 // Example: Maximum 12 people per booking
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  specialRequests: {
    type: String,
    trim: true
  }
});

bookingSchema.index({ user: 1, table: 1 });

bookingSchema.pre('save', function(next) {
  if (this.endTime <= this.startTime) {
    next(new Error('End time must be after start time'));
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);
