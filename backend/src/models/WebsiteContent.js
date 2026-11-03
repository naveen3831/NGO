import mongoose from 'mongoose';

const websiteContentSchema = new mongoose.Schema(
  {
    orgName: {
      type: String,
      default: 'Godhavari Nadhi Paryavarana Parishubratha',
    },
    tagline: {
      type: String,
      default: 'Dedicated to the cleanliness, ecological revival, and purity of the sacred River Godavari',
    },
    mission: {
      type: String,
      default: 'To restore and protect the sacred Godavari River through sustained community cleanliness drives, riverbed desiltation, plastic pollution prevention, and widespread environmental awareness.',
    },
    vision: {
      type: String,
      default: 'A pristine, free-flowing, and vibrant River Godavari cherished and guarded by every riverbank community for generations to come.',
    },
    statistics: {
      cleanlinessDrives: { type: Number, default: 142 },
      volunteersActive: { type: Number, default: 1250 },
      wasteRemovedTons: { type: Number, default: 85 },
      ghatsCleaned: { type: Number, default: 18 },
      treesPlanted: { type: Number, default: 3500 },
    },
    contactInfo: {
      email: { type: String, default: 'contact@godhavarinadhiorg.in' },
      phone: { type: String, default: '+91 883 245 7890' },
      helpline: { type: String, default: '+91 944 012 3456' },
      address: { type: String, default: 'Godavari Bund Road, Near Kotilingala Ghat, Rajahmundry, Andhra Pradesh - 533101' },
      officeHours: { type: String, default: 'Monday - Saturday: 9:00 AM - 6:00 PM' },
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const WebsiteContent = mongoose.model('WebsiteContent', websiteContentSchema);
export default WebsiteContent;

