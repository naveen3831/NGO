import User from '../models/User.js';
import Membership from '../models/Membership.js';
import generateToken from '../utils/generateToken.js';

// @desc    Admin login
// @route   POST /api/v1/auth/admin/login
// @access  Public
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Invalid admin credentials or unauthorized' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    res.json({
      _id: user._id,
      memberId: user.memberId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      designation: user.designation,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Member login (email or memberId + password)
// @route   POST /api/v1/auth/member/login
// @access  Public
export const memberLogin = async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // Can be email, memberId, or phone

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide Member ID / Email and password' });
    }

    // Match by email, memberId, or phone
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { memberId: identifier.toUpperCase() },
        { phone: identifier },
      ],
    }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Member record not found' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Fetch membership status
    const membership = await Membership.findOne({ user: user._id });

    res.json({
      _id: user._id,
      memberId: user.memberId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      designation: user.designation,
      avatar: user.avatar,
      address: user.address,
      membership: membership || null,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new member
// @route   POST /api/v1/auth/register
// @access  Public
export const registerMember = async (req, res, next) => {
  try {
    const { name, email, phone, password, address, bloodGroup, membershipType } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email or phone already exists' });
    }

    // Generate unique Member ID: GNPP-2026-XXXX
    const count = await User.countDocuments();
    const memberId = `GNPP-2026-${String(count + 101).padStart(4, '0')}`;

    const user = await User.create({
      memberId,
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'member',
      bloodGroup: bloodGroup || 'O+',
      address: address || { city: 'Rajahmundry', state: 'Andhra Pradesh' },
    });

    // Create corresponding Membership entry
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + (membershipType === 'Life Member' ? 25 : 1));

    const membership = await Membership.create({
      user: user._id,
      membershipNumber: `MEM-${memberId}`,
      membershipType: membershipType || 'Annual Member',
      status: 'Active',
      validFrom: new Date(),
      validTo: validUntil,
      feePaid: membershipType === 'Life Member' ? 5000 : 500,
      paymentStatus: 'Paid',
    });

    res.status(201).json({
      _id: user._id,
      memberId: user.memberId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      designation: user.designation,
      membership,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile & membership
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const membership = await Membership.findOne({ user: user._id });

    res.json({
      user,
      membership,
    });
  } catch (error) {
    next(error);
  }
};
