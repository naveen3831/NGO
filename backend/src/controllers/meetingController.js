import Meeting from '../models/Meeting.js';

// @desc    Get meetings permitted for members
// @route   GET /api/v1/member/meetings
// @access  Private (Member)
export const getMemberMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find({ status: { $ne: 'Cancelled' } })
      .sort({ date: 1 })
      .populate('createdBy', 'name designation');
    res.json(meetings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all meetings (Admin)
// @route   GET /api/v1/admin/meetings
// @access  Private (Admin)
export const getAllMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find()
      .sort({ date: -1 })
      .populate('createdBy', 'name designation');
    res.json(meetings);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new meeting (Admin)
// @route   POST /api/v1/admin/meetings
// @access  Private (Admin)
export const createMeeting = async (req, res, next) => {
  try {
    const {
      title,
      meetingType,
      agenda,
      date,
      time,
      location,
      isVirtual,
      meetingLink,
      targetAudience,
    } = req.body;

    const meeting = await Meeting.create({
      title,
      meetingType: meetingType || 'Executive Committee',
      agenda,
      date: new Date(date),
      time: time || '06:00 PM - 07:30 PM',
      location: location || 'NGO Head Office, Godavari Bund Road, Rajahmundry',
      isVirtual: !!isVirtual,
      meetingLink,
      targetAudience: targetAudience || 'All Members',
      createdBy: req.user._id,
    });

    res.status(201).json(meeting);
  } catch (error) {
    next(error);
  }
};

// @desc    Update meeting (Admin)
// @route   PATCH /api/v1/admin/meetings/:id
// @access  Private (Admin)
export const updateMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    Object.assign(meeting, req.body);
    const updatedMeeting = await meeting.save();

    res.json(updatedMeeting);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete meeting (Admin)
// @route   DELETE /api/v1/admin/meetings/:id
// @access  Private (Admin)
export const deleteMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    await Meeting.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meeting successfully removed' });
  } catch (error) {
    next(error);
  }
};

