import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
    },
    eventType: {
      type: String,
      enum: ['Cleanliness Drive', 'Awareness Program', 'Workshop', 'Tree Plantation', 'Riverfront Rally'],
      default: 'Cleanliness Drive',
    },
    category: {
      type: String,
      default: 'Environmental Protection',
    },
    date: {
      type: Date,
      required: [true, 'Please provide event date'],
    },
    time: {
      type: String,
      default: '07:00 AM - 10:00 AM',
    },
    location: {
      venue: { type: String, required: true },
      city: { type: String, default: 'Rajahmundry' },
      riverGhat: { type: String, default: 'Kotilingala Ghat' },
      mapCoordinates: String,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    isMemberOnly: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    },
    targetVolunteers: {
      type: Number,
      default: 50,
    },
    enrolledVolunteersCount: {
      type: Number,
      default: 0,
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

const Event = mongoose.model('Event', eventSchema);
export default Event;

