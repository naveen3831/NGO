import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide notification title'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide notification message'],
    },
    type: {
      type: String,
      enum: ['Alert', 'Event Reminder', 'Meeting Notice', 'General Announcement', 'Membership Update'],
      default: 'General Announcement',
    },
    targetAudience: {
      type: String,
      enum: ['All Members', 'Active Volunteers', 'Specific Member'],
      default: 'All Members',
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // If targeted to a specific member
    },
    channel: {
      type: String,
      enum: ['In-App', 'Push Notification', 'SMS', 'Broadcast'],
      default: 'In-App',
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;

