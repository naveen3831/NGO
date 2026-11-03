import WebsiteContent from '../models/WebsiteContent.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Meeting from '../models/Meeting.js';
import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';
import Membership from '../models/Membership.js';

// @desc    Get public website content and stats
// @route   GET /api/v1/public/content
// @access  Public
export const getWebsiteContent = async (req, res, next) => {
  try {
    let content = await WebsiteContent.findOne();
    if (!content) {
      content = await WebsiteContent.create({});
    }

    // Dynamic stats calculated from real database records
    const totalMembers = await User.countDocuments({ role: { $in: ['member', 'volunteer'] } });
    const totalCleanlinessDrives = await Event.countDocuments({ eventType: 'Cleanliness Drive' });
    const totalUpcomingEvents = await Event.countDocuments({ status: 'Upcoming' });

    res.json({
      ...content.toObject(),
      dynamicStats: {
        totalMembers,
        totalCleanlinessDrives,
        totalUpcomingEvents,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard metrics & stats
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res, next) => {
  try {
    const totalMembers = await User.countDocuments({ role: { $in: ['member', 'volunteer', 'staff'] } });
    const activeMembers = await Membership.countDocuments({ status: 'Active' });
    const pendingMemberships = await Membership.countDocuments({ status: 'Pending Approval' });
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
    const totalMeetings = await Meeting.countDocuments();
    const scheduledMeetings = await Meeting.countDocuments({ status: 'Scheduled' });
    const totalAnnouncements = await Announcement.countDocuments();
    const totalNotifications = await Notification.countDocuments();

    // Recent items for quick preview
    const recentMembers = await User.find({ role: { $ne: 'admin' } })
      .sort({ createdAt: -1 })
      .limit(5);

    const upcomingEventsList = await Event.find({ status: 'Upcoming' })
      .sort({ date: 1 })
      .limit(5);

    const recentAnnouncements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      counts: {
        totalMembers,
        activeMembers,
        pendingMemberships,
        totalEvents,
        upcomingEvents,
        totalMeetings,
        scheduledMeetings,
        totalAnnouncements,
        totalNotifications,
      },
      recentMembers,
      upcomingEventsList,
      recentAnnouncements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update website CMS content (Admin)
// @route   PATCH /api/v1/admin/content
// @access  Private (Admin)
export const updateWebsiteContent = async (req, res, next) => {
  try {
    let content = await WebsiteContent.findOne();
    if (!content) {
      content = new WebsiteContent();
    }

    Object.assign(content, req.body);
    content.lastUpdatedBy = req.user._id;
    const updated = await content.save();

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

