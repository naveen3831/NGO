import User from '../models/User.js';
import Membership from '../models/Membership.js';
import Notification from '../models/Notification.js';
import generateToken from '../utils/generateToken.js';
import { sendRegistrationEmail } from '../utils/emailService.js';
import { broadcastAdminEvent } from '../utils/realtimeHub.js';
import { resolveCloudinaryImage } from '../utils/cloudinaryService.js';

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

    // Map shorthand 'admin' or 'administrator' to 'admin@gmail.com'
    const targetEmail =
      email === 'admin' || email === 'administrator' ? 'admin@gmail.com' : email;

    // Find admin by email, memberId, or phone
    let user = await User.findOne({
      $or: [
        { email: targetEmail },
        { memberId: targetEmail.toUpperCase() },
        { phone: targetEmail },
      ],
    }).select('+password');

    // Fallback: If searched email contains 'admin' and no user found, find the active admin
    if (!user && (targetEmail === 'admin@gmail.com' || targetEmail.includes('admin'))) {
      user = await User.findOne({ role: 'admin' }).select('+password');
    }

    if (!user) {
      return res.status(401).json({ message: 'No administrator account found with this email or ID' });
    }

    const allowedAdminRoles = [
      'admin',
      'super_admin',
      'staff_coordinator',
      'staff',
      'Super Admin',
      'Admin',
      'Staff Coordinator',
      'General Volunteer',
    ];

    if (!allowedAdminRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied: Account does not have administrator privileges' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password. Please check and try again.' });
    }

    if (
      user.email !== 'admin@gmail.com' &&
      (user.isActive === false || user.accountStatus?.toLowerCase() === 'inactive')
    ) {
      return res.status(403).json({
        code: 'ACCOUNT_SUSPENDED',
        suspended: true,
        message: 'Your account is suspended. Please contact the administrator.',
        reason: user.accessReason || '',
      });
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

    // Require administrator approval before member/volunteer login is permitted
    const lowerRole = (user.role || '').toLowerCase();
    if (
      lowerRole === 'member' ||
      lowerRole === 'volunteer' ||
      lowerRole === 'general volunteer' ||
      lowerRole === 'general_volunteer'
    ) {
      const mStatus = membership?.status || 'Pending';
      if (
        mStatus === 'Suspended' ||
        user.accountStatus?.toLowerCase() === 'inactive' ||
        user.isActive === false
      ) {
        return res.status(403).json({
          code: 'ACCOUNT_SUSPENDED',
          suspended: true,
          message: 'Your account has been suspended. Please contact the administrator.',
          reason: membership?.remarks || user.accessReason || '',
        });
      }
      if (mStatus === 'Pending' || mStatus === 'Pending Approval' || user.accountStatus === 'Pending') {
        return res.status(403).json({
          message: 'Your registration is pending administrator approval. You can log in once approved.',
        });
      }
      if (mStatus === 'Rejected') {
        return res.status(403).json({
          message: membership?.remarks
            ? `Your registration was not approved. Reason: ${membership.remarks}`
            : 'Your registration was not approved by the administrator.',
        });
      }
      if (mStatus !== 'Active' && mStatus !== 'Approved') {
        return res.status(403).json({
          message: 'Your account is not active yet. Please contact the administrator.',
        });
      }
    }

    res.json({
      _id: user._id,
      memberId: user.memberId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      accountStatus: user.accountStatus,
      isActive: user.isActive,
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
    let { name, email, phone, password, address, bloodGroup, membershipType, gender, dateOfBirth, occupation, avatar } = req.body;

    email = email.trim().toLowerCase();
    phone = phone.trim();
    name = name.trim();

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email or phone number already exists' });
    }

    const isVolunteer = membershipType === 'Volunteer Member';
    const isFreeTier = isVolunteer || membershipType === 'Student Member';

    // Generate unique Member ID: GNPP-2026-XXXX
    const count = await User.countDocuments();
    const memberId = `GNPP-2026-${String(count + 101).padStart(4, '0')}`;

    const resolvedAvatar =
      typeof avatar === 'string' && avatar.trim()
        ? await resolveCloudinaryImage(avatar.trim(), 'avatars')
        : '';

    const user = await User.create({
      memberId,
      name,
      email,
      phone,
      password: password.trim(),
      role: isVolunteer ? 'volunteer' : 'member',
      designation: isVolunteer ? 'Community Volunteer' : 'General Member',
      accountStatus: 'Pending',
      bloodGroup: bloodGroup || 'O+',
      gender: gender || '',
      dateOfBirth: dateOfBirth || '',
      occupation: occupation || '',
      avatar: resolvedAvatar,
      address: address || { city: 'Rajahmundry', state: 'Andhra Pradesh' },
    });

    // Create corresponding Membership entry
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + (membershipType === 'Life Member' ? 25 : 1));

    const membership = await Membership.create({
      user: user._id,
      membershipNumber: `MEM-${memberId}`,
      membershipType: membershipType || 'Annual Member',
      status: 'Pending',
      validFrom: new Date(),
      validTo: validUntil,
      feePaid: membershipType === 'Life Member' ? 5000 : isFreeTier ? 0 : 500,
      paymentStatus: isFreeTier ? 'Waived' : 'Paid',
    });

    await Notification.create({
      title: isVolunteer ? 'Volunteer Registration Received' : 'Membership Application Received',
      message: isVolunteer
        ? `Your volunteer registration (${memberId}) has been submitted and is currently Pending coordinator review.`
        : `Your membership application (${memberId}) has been submitted and is currently Pending admin review.`,
      type: 'Membership Update',
      targetAudience: 'Specific Member',
      recipient: user._id,
      sentBy: user._id,
    });

    const adminNotif = await Notification.create({
      title: isVolunteer
        ? `New Volunteer Registration: ${user.name}`
        : `New Member Registration: ${user.name}`,
      message: `${user.name} (${memberId}) registered as ${membership.membershipType}. Pending verification.`,
      type: 'New Registration',
      targetAudience: 'Admins',
      recipient: user._id,
      sentBy: user._id,
    });

    broadcastAdminEvent('new_registration', {
      notification: {
        ...adminNotif.toObject(),
        recipient: {
          _id: user._id,
          name: user.name,
          memberId: user.memberId,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        isRead: false,
      },
      member: {
        _id: user._id,
        name: user.name,
        memberId: user.memberId,
        membershipType: membership.membershipType,
        status: membership.status,
      },
    });

    await sendRegistrationEmail({
      to: user.email,
      name: user.name,
      memberId: user.memberId,
      membershipType: membership.membershipType,
      isVolunteer,
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
      pendingApproval: true,
      message: 'Registration submitted. You can sign in once the administrator approves your account.',
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
    const isSuspended = Boolean(
      user &&
        user.email !== 'admin@gmail.com' &&
        (user.isActive === false ||
          user.accountStatus?.toLowerCase() === 'inactive' ||
          membership?.status === 'Suspended')
    );

    res.json({
      user,
      membership,
      isSuspended,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged-in user's profile portrait image only
// @route   PATCH /api/v1/auth/avatar
// @access  Private
export const updateMyAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const membership = await Membership.findOne({ user: user._id }).lean();
    if (
      user.email !== 'admin@gmail.com' &&
      (user.isActive === false ||
        user.accountStatus?.toLowerCase() === 'inactive' ||
        membership?.status === 'Suspended')
    ) {
      return res.status(403).json({
        code: 'ACCOUNT_SUSPENDED',
        suspended: true,
        message: 'Your account has been suspended. Please contact the administrator.',
      });
    }

    const { avatar } = req.body;
    if (avatar !== undefined && typeof avatar !== 'string') {
      return res.status(400).json({ message: 'Invalid profile image payload' });
    }

    const cleaned = (avatar || '').trim();
    if (cleaned && !cleaned.startsWith('data:image/') && !/^https?:\/\//i.test(cleaned)) {
      return res.status(400).json({ message: 'Profile image must be a valid image upload or URL' });
    }
    if (cleaned.length > 15 * 1024 * 1024) {
      return res.status(400).json({ message: 'Profile image is too large (max 15 MB)' });
    }

    user.avatar = cleaned ? await resolveCloudinaryImage(cleaned, 'avatars') : '';
    const saved = await user.save();

    res.json({
      message: cleaned ? 'Profile image updated successfully' : 'Profile image removed',
      avatar: saved.avatar,
      user: saved,
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

    const { name, email, phone, designation, bio, officeLocation, avatar, currentPassword, newPassword } = req.body;

    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (phone) user.phone = phone.trim();
    if (designation !== undefined) user.designation = designation.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (officeLocation !== undefined) user.officeLocation = officeLocation.trim();
    if (avatar !== undefined && typeof avatar === 'string') {
      user.avatar = avatar.trim()
        ? await resolveCloudinaryImage(avatar.trim(), 'avatars')
        : '';
    }

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
        designation: user.designation,
        bio: user.bio,
        officeLocation: user.officeLocation,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};
