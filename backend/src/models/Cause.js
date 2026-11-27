import mongoose from 'mongoose';

const causeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a cause title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a cause description'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please provide target amount'],
      default: 0,
    },
    raisedAmount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category (e.g. Education, Health, Environment)'],
      default: 'General',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Cause = mongoose.model('Cause', causeSchema);
export default Cause;

