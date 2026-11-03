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

    res.json(events);
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

// @desc    Volunteer enrollment for an event
// @route   POST /api/v1/events/:id/enroll
// @access  Private (Member)
export const enrollInEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.enrolledVolunteersCount = (event.enrolledVolunteersCount || 0) + 1;
    await event.save();

    res.json({ message: 'Successfully registered for this cleanliness drive / event', event });
  } catch (error) {
    next(error);
  }
};

