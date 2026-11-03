import Notification from '../models/Notification.js';

// @desc    Get notifications for logged in member
// @route   GET /api/v1/member/notifications
// @access  Private (Member)
export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { targetAudience: 'All Members' },
        { recipient: req.user._id },
      ],
    })
      .sort({ createdAt: -1 })
      .populate('sentBy', 'name designation');

    // Add isRead flag
    const mapped = notifications.map((n) => ({
      ...n.toObject(),
      isRead: n.readBy.some((uid) => uid.toString() === req.user._id.toString()),
    }));

    res.json(mapped);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/v1/member/notifications/:id/read
// @access  Private (Member)
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (!notification.readBy.includes(req.user._id)) {
      notification.readBy.push(req.user._id);
      await notification.save();
    }

    res.json({ message: 'Marked as read', notificationId: notification._id });
  } catch (error) {
    next(error);
  }
};

// @desc    Send notification to members (Admin)
// @route   POST /api/v1/admin/notifications
// @access  Private (Admin)
export const sendNotification = async (req, res, next) => {
  try {
    const { title, message, type, targetAudience, recipient, channel } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type: type || 'General Announcement',
      targetAudience: targetAudience || 'All Members',
      recipient: recipient || null,
      channel: channel || 'In-App',
      sentBy: req.user._id,
    });

    res.status(201).json({
      message: 'Notification dispatched successfully to target recipients',
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all sent notifications (Admin)
// @route   GET /api/v1/admin/notifications
// @access  Private (Admin)
export const getAllNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .populate('sentBy', 'name designation')
      .populate('recipient', 'name memberId email');
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

