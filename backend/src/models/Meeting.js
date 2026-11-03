import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide meeting title'],
      trim: true,
    },
    meetingType: {
      type: String,
      enum: ['Executive Committee', 'General Body', 'Volunteer Briefing', 'Annual General Meeting', 'Core Planning'],
      default: 'Executive Committee',
    },
    agenda: {
      type: String,
      required: [true, 'Please provide meeting agenda'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide meeting date'],
    },
    time: {
      type: String,
      default: '06:00 PM - 07:30 PM',
    },
    location: {
      type: String,
      default: 'NGO Head Office, Godavari Bund Road, Rajahmundry',
    },
    isVirtual: {
      type: Boolean,
      default: false,
    },
    meetingLink: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Postponed'],
      default: 'Scheduled',
    },
    minutesOfMeeting: {
      type: String,
      default: '',
    },
    targetAudience: {
      type: String,
      enum: ['All Members', 'Executive Committee Only', 'Volunteers Only'],
      default: 'All Members',
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

const Meeting = mongoose.model('Meeting', meetingSchema);
export default Meeting;

