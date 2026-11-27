import ContactMessage from '../models/ContactMessage.js';
import GalleryItem from '../models/GalleryItem.js';
import Donation from '../models/Donation.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import Announcement from '../models/Announcement.js';
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from '../utils/cloudinaryService.js';

// @desc    Submit contact message from public Contact Us form
// @route   POST /api/v1/public/contact
// @access  Public
export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const created = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      message: 'Message received. Our secretariat will respond shortly.',
      contact: created,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages (Admin)
// @route   GET /api/v1/admin/contacts
// @access  Private (Admin)
export const getAllContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message status/notes (Admin)
// @route   PATCH /api/v1/admin/contacts/:id
// @access  Private (Admin)
export const updateContactMessageStatus = async (req, res, next) => {
  try {
    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.status && { status: req.body.status }),
        ...(req.body.adminNotes !== undefined && { adminNotes: req.body.adminNotes }),
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message (Admin)
// @route   DELETE /api/v1/admin/contacts/:id
// @access  Private (Admin)
export const deleteContactMessage = async (req, res, next) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    res.json({ message: 'Contact message deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public gallery photos
// @route   GET /api/v1/public/gallery
// @access  Public
export const getPublicGallery = async (req, res, next) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Add gallery photo (Admin)
// @route   POST /api/v1/admin/gallery
// @access  Private (Admin)
export const createGalleryItem = async (req, res, next) => {
  try {
    const { title, category, imageUrl, location, dateLabel, caption } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ message: 'Photo title and image are required' });
    }

    const uploaded = await uploadImageToCloudinary(imageUrl, { folder: 'gallery' });
    if (!uploaded.url) {
      return res.status(400).json({ message: 'Failed to store photo in Cloudinary' });
    }

    const item = await GalleryItem.create({
      title: title.trim(),
      category: category || 'River Cleaning',
      imageUrl: uploaded.url,
      cloudinaryPublicId: uploaded.publicId || '',
      location: location ? location.trim() : 'Godavari Riverfront, Rajahmundry',
      dateLabel: dateLabel || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      caption: caption ? caption.trim() : '',
      createdBy: req.user?._id,
    });

    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery photo (Admin)
// @route   DELETE /api/v1/admin/gallery/:id
// @access  Private (Admin)
export const deleteGalleryItem = async (req, res, next) => {
  try {
    const deleted = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Gallery photo not found' });
    }
    await deleteImageFromCloudinary(deleted.cloudinaryPublicId || deleted.imageUrl);
    res.json({ message: 'Gallery photo deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create public donation pledge/record
// @route   POST /api/v1/public/donations
// @access  Public
export const createDonation = async (req, res, next) => {
  try {
    const { donorName, email, phone, amount, purpose, paymentMethod, message } = req.body;
    const numericAmount = Number(amount);
    if (!donorName || !numericAmount || numericAmount < 1) {
      return res.status(400).json({ message: 'Please provide donor name and valid donation amount.' });
    }

    const receiptNumber = `GNPP-DON-${Date.now().toString().slice(-6)}`;
    const donation = await Donation.create({
      donorName: donorName.trim(),
      email: email ? email.trim().toLowerCase() : '',
      phone: phone ? phone.trim() : '',
      amount: numericAmount,
      purpose: purpose || 'Godavari River Conservation Fund',
      paymentMethod: paymentMethod || 'UPI',
      status: 'Completed',
      receiptNumber,
      message: message ? message.trim() : '',
    });

    res.status(201).json({
      message: 'Thank you for supporting River Godavari conservation!',
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations (Admin)
// @route   GET /api/v1/admin/donations
// @access  Private (Admin)
export const getAllDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete donation record (Admin)
// @route   DELETE /api/v1/admin/donations/:id
// @access  Private (Admin)
export const deleteDonation = async (req, res, next) => {
  try {
    const deleted = await Donation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Donation record not found' });
    }
    res.json({ message: 'Donation record removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/v1/public/newsletter
// @access  Public
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    const normalized = email.trim().toLowerCase();
    const existing = await NewsletterSubscriber.findOne({ email: normalized });
    if (existing) {
      return res.status(200).json({ message: 'You are already subscribed to Godavari updates!' });
    }

    await NewsletterSubscriber.create({ email: normalized });
    res.status(201).json({ message: 'Subscribed successfully to our conservation updates!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single public announcement by ID
// @route   GET /api/v1/public/announcements/:id
// @access  Public
export const getPublicAnnouncementById = async (req, res, next) => {
  try {
    const item = await Announcement.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

