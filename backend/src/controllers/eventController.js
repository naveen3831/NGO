import Event from '../models/Event.js';

// @desc    Get all public events & cleanliness drives
// @route   GET /api/v1/public/events
// @access  Public
export const getPublicEvents = async (req, res, next) => {
  try {
    const { eventType, status } = req.query;
    const query = { isPublic: true };

    if (eventType) query.eventType = eventType;
    if (status) query.status = status;

    const events = await Event.find(query)
      .sort({ date: 1 })
      .populate('createdBy', 'name designation');

    res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events visible to members (Public + Member Only)
// @route   GET /api/v1/member/events
// @access  Private (Member)
export const getMemberEvents = async (req, res, next) => {
  try {
    const { eventType, status } = req.query;
    const query = {};

    if (eventType) query.eventType = eventType;
    if (status) query.status = status;

    const events = await Event.find(query)
      .sort({ date: 1 })
      .populate('createdBy', 'name designation');

    const userIdStr = req.user?._id ? String(req.user._id) : '';
    const enriched = events.map((evt) => {
      const obj = evt.toObject();
      const match = (obj.volunteerRequests || []).find(
        (r) => String(r.user) === userIdStr
      );
      return {
        ...obj,
        myVolunteerStatus: match ? match.status : null,
      };
    });

    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/v1/events/:id
// @access  Public / Private
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email designation');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event / cleanliness drive (Admin)
// @route   POST /api/v1/admin/events
// @access  Private (Admin)
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      eventType,
      date,
      time,
      location,
      isPublic = true,
      isMemberOnly = false,
      bannerImage,
      targetVolunteers,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      eventType: eventType || 'Cleanliness Drive',
      date: new Date(date),
      time: time || '07:00 AM - 10:00 AM',
      location: location || { venue: 'Kotilingala Ghat, Rajahmundry' },
      isPublic,
      isMemberOnly,
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
      targetVolunteers: targetVolunteers || 50,
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Update event (Admin)
// @route   PATCH /api/v1/admin/events/:id
// @access  Private (Admin)
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    Object.assign(event, req.body);
    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event (Admin)
// @route   DELETE /api/v1/admin/events/:id
// @access  Private (Admin)
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event successfully removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Volunteer enrollment request for an event (requires Admin approval)
// @route   POST /api/v1/member/events/:id/enroll
// @access  Private (Member)
export const enrollInEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const userIdStr = String(req.user._id);
    const existing = (event.volunteerRequests || []).find(
      (r) => String(r.user) === userIdStr
    );

    if (existing) {
      return res.json({
        message:
          existing.status === 'Confirmed'
            ? 'You are already confirmed as a volunteer for this drive.'
            : 'Your volunteer request is awaiting admin approval.',
        status: existing.status,
        event,
      });
    }

    event.volunteerRequests.push({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      memberId: req.user.memberId || '',
      status: 'Pending',
      requestedAt: new Date(),
    });
    await event.save();

    res.status(201).json({
      message: 'Volunteer request sent to Admin for approval.',
      status: 'Pending',
      event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin approves or rejects a volunteer request
// @route   PATCH /api/v1/admin/events/:id/volunteers/:requestId
// @access  Private (Admin)
export const reviewVolunteerRequest = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Confirmed', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Confirmed or Rejected' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const request = event.volunteerRequests.id(req.params.requestId);
    if (!request) {
      return res.status(404).json({ message: 'Volunteer request not found' });
    }

    const prevStatus = request.status;
    request.status = status;
    request.reviewedAt = new Date();

    if (prevStatus !== 'Confirmed' && status === 'Confirmed') {
      event.enrolledVolunteersCount = (event.enrolledVolunteersCount || 0) + 1;
    } else if (prevStatus === 'Confirmed' && status !== 'Confirmed') {
      event.enrolledVolunteersCount = Math.max(0, (event.enrolledVolunteersCount || 0) - 1);
    }

    await event.save();
    res.json({
      message: status === 'Confirmed' ? 'Volunteer confirmed!' : 'Volunteer request declined.',
      event,
    });
  } catch (error) {
    next(error);
  }
};

