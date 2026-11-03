import Cause from '../models/Cause.js';

// @desc    Get all causes
// @route   GET /api/causes
// @access  Public
export const getCauses = async (req, res, next) => {
  try {
    const causes = await Cause.find().populate('createdBy', 'name email');
    res.json(causes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single cause
// @route   GET /api/causes/:id
// @access  Public
export const getCauseById = async (req, res, next) => {
  try {
    const cause = await Cause.findById(req.params.id).populate('createdBy', 'name email');
    if (cause) {
      res.json(cause);
    } else {
      res.status(404).json({ message: 'Cause not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new cause
// @route   POST /api/causes
// @access  Private (e.g. Volunteer / Admin)
export const createCause = async (req, res, next) => {
  try {
    const { title, description, targetAmount, category, imageUrl } = req.body;

    const cause = new Cause({
      title,
      description,
      targetAmount,
      category,
      imageUrl,
      createdBy: req.user._id,
    });

    const createdCause = await cause.save();
    res.status(201).json(createdCause);
  } catch (error) {
    next(error);
  }
};

