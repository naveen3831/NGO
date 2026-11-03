import User from '../models/User.js';
import Membership from '../models/Membership.js';
import generateToken from '../utils/generateToken.js';

// @desc    Admin login
// @route   POST /api/v1/auth/admin/login
// @access  Public
export const adminLogin = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    // Find admin by email (case-insensitive)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'No administrator account found with this email' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Account does not have administrator privileges' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password. Please check and try again.' });
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

// @desc    Member login (email, memberId, or phone)
// @route   POST /api/v1/auth/member/login
// @access  Public
export const memberLogin = async (req, res, next) => {
  try {
    let { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide Member ID / Email and password' });
    }

    identifier = identifier.trim();
    password = password.trim();

    // Match by email, memberId, or phone
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { memberId: identifier.toUpperCase() },
        { phone: identifier },
      ],
    }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Member record not found. Please verify your Member ID or email.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password. Please try again.' });
    }

    // Fetch membership details
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
    let { name, email, phone, password, address, bloodGroup, membershipType } = req.body;

    email = email.trim().toLowerCase();
    phone = phone.trim();
    name = name.trim();

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email or phone number already exists' });
    }

    // Generate unique Member ID: GNPP-2026-XXXX
    const count = await User.countDocuments();
    const memberId = `GNPP-2026-${String(count + 101).padStart(4, '0')}`;

    const user = await User.create({
      memberId,
      name,
      email,
      phone,
      password: password.trim(),
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

// @desc    Update admin settings / profile
// @route   PATCH /api/v1/admin/settings
// @access  Private (Admin)
export const updateAdminSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, phone, currentPassword, newPassword } = req.body;

    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (phone) user.phone = phone.trim();

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password does not match' });
      }
      user.password = newPassword.trim();
    }

    await user.save();

    res.json({
      message: 'Settings updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
