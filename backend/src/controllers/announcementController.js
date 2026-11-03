import Announcement from '../models/Announcement.js';

// @desc    Get public announcements
// @route   GET /api/v1/public/announcements
// @access  Public
export const getPublicAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({
      isPublished: true,
      visibility: { $in: ['Public', 'All'] },
    })
      .sort({ publishedAt: -1 })
      .populate('createdBy', 'name designation');
    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

// @desc    Get member announcements (Members Only + All + Public)
// @route   GET /api/v1/member/announcements
// @access  Private (Member)
export const getMemberAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .populate('createdBy', 'name designation');
    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all announcements (Admin)
// @route   GET /api/v1/admin/announcements
// @access  Private (Admin)
export const getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name designation');
    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

// @desc    Create announcement (Admin)
// @route   POST /api/v1/admin/announcements
// @access  Private (Admin)
export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, category, priority, visibility, expiresAt } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      category: category || 'General Update',
      priority: priority || 'Normal',
      visibility: visibility || 'All',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: req.user._id,
    });

    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
};

// @desc    Update announcement (Admin)
// @route   PATCH /api/v1/admin/announcements/:id
// @access  Private (Admin)
export const updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    Object.assign(announcement, req.body);
    const updatedAnnouncement = await announcement.save();

    res.json(updatedAnnouncement);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement (Admin)
// @route   DELETE /api/v1/admin/announcements/:id
// @access  Private (Admin)
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement successfully removed' });
  } catch (error) {
    next(error);
  }
};

