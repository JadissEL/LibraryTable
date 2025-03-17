import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  location: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String,
    enum: ['power_outlet', 'window_view', 'quiet_zone', 'group_study']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

tableSchema.index({ tableNumber: 1 }, { unique: true });

export default mongoose.model('Table', tableSchema);
