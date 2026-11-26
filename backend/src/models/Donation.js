import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: [true, 'Please provide donor name'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      required: [true, 'Please provide donation amount'],
      min: [1, 'Donation amount must be at least 1'],
    },
    purpose: {
      type: String,
      default: 'Godavari River Conservation Fund',
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Bank Transfer', 'Card', 'Cash / In-Person'],
      default: 'UPI',
    },
    status: {
      type: String,
      enum: ['Verified', 'Pending', 'Completed'],
      default: 'Completed',
    },
    receiptNumber: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;

