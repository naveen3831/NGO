import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a photo title'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['River Cleaning', 'Plantation', 'Awareness', 'Events'],
      default: 'River Cleaning',
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL or upload'],
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: 'Godavari Riverfront, Rajahmundry',
    },
    dateLabel: {
      type: String,
      trim: true,
      default: '',
    },
    caption: {
      type: String,
      trim: true,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const GalleryItem = mongoose.model('GalleryItem', galleryItemSchema);
export default GalleryItem;

