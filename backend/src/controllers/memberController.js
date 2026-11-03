import User from '../models/User.js';
import Membership from '../models/Membership.js';

// @desc    Get all members with search, filter, and pagination
// @route   GET /api/v1/admin/members
// @access  Private (Admin)
export const getAllMembers = async (req, res, next) => {
  try {
    const { keyword, status, role, page = 1, limit = 50 } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } },
        { memberId: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const count = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Attach membership details for each user
    const userIds = users.map((u) => u._id);
    const memberships = await Membership.find({ user: { $in: userIds } });
    const membershipMap = {};
    memberships.forEach((m) => {
      membershipMap[m.user.toString()] = m;
    });

    const enrichedMembers = users.map((u) => ({
      ...u.toObject(),
      membership: membershipMap[u._id.toString()] || null,
    }));

    // Filter by membership status if requested
    let finalMembers = enrichedMembers;
    if (status) {
      finalMembers = enrichedMembers.filter(
        (m) => m.membership && m.membership.status.toLowerCase() === status.toLowerCase()
      );
    }

    res.json({
      members: finalMembers,
      page: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
      totalMembers: count,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new member (Admin)
// @route   POST /api/v1/admin/members
// @access  Private (Admin)
export const createMemberByAdmin = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      role = 'member',
      designation = 'General Member',
      membershipType = 'Annual Member',
      bloodGroup,
      address,
      password = 'password123',
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    const count = await User.countDocuments();
    const memberId = `GNPP-2026-${String(count + 101).padStart(4, '0')}`;

    const user = await User.create({
      memberId,
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role,
      designation,
      bloodGroup: bloodGroup || 'O+',
      address: address || { city: 'Rajahmundry', state: 'Andhra Pradesh' },
    });

    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + (membershipType === 'Life Member' ? 25 : 1));

    const membership = await Membership.create({
      user: user._id,
      membershipNumber: `MEM-${memberId}`,
      membershipType,
      status: 'Active',
      validFrom: new Date(),
      validTo: validUntil,
      feePaid: membershipType === 'Life Member' ? 5000 : 500,
      paymentStatus: 'Paid',
      approvedBy: req.user._id,
    });

    res.status(201).json({
      ...user.toObject(),
      membership,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get member by ID (Admin)
// @route   GET /api/v1/admin/members/:id
// @access  Private (Admin)
export const getMemberById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const membership = await Membership.findOne({ user: user._id });

    res.json({
      ...user.toObject(),
      membership,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update member details (Admin)
// @route   PATCH /api/v1/admin/members/:id
// @access  Private (Admin)
export const updateMemberById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const { name, email, phone, role, designation, bloodGroup, isActive, address } = req.body;

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (designation) user.designation = designation;
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (address) user.address = address;

    const updatedUser = await user.save();
    const membership = await Membership.findOne({ user: user._id });

    res.json({
      ...updatedUser.toObject(),
      membership,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update membership status (Admin)
// @route   PATCH /api/v1/admin/members/:id/membership
// @access  Private (Admin)
export const updateMembershipStatus = async (req, res, next) => {
  try {
    const { status, membershipType, validTo, feePaid, paymentStatus } = req.body;

    let membership = await Membership.findOne({ user: req.params.id });

    if (!membership) {
      // Create if doesn't exist
      membership = new Membership({
        user: req.params.id,
        membershipNumber: `MEM-${req.params.id.slice(-6).toUpperCase()}`,
        approvedBy: req.user._id,
      });
    }

    if (status) membership.status = status;
    if (membershipType) membership.membershipType = membershipType;
    if (validTo) membership.validTo = new Date(validTo);
    if (feePaid !== undefined) membership.feePaid = feePaid;
    if (paymentStatus) membership.paymentStatus = paymentStatus;

    const updatedMembership = await membership.save();
    res.json(updatedMembership);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete / deactivate member (Admin)
// @route   DELETE /api/v1/admin/members/:id
// @access  Private (Admin)
export const deleteMemberById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Administrator cannot delete their own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    await Membership.findOneAndDelete({ user: req.params.id });

    res.json({ message: 'Member record successfully removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all memberships with user details
// @route   GET /api/v1/admin/memberships
// @access  Private (Admin)
export const getAllMemberships = async (req, res, next) => {
  try {
    const { status, membershipType, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (membershipType) query.membershipType = membershipType;

    let memberships = await Membership.find(query)
      .populate('user', 'name email phone memberId designation bloodGroup address')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      memberships = memberships.filter(
        (m) =>
          (m.user?.name && m.user.name.toLowerCase().includes(s)) ||
          (m.user?.memberId && m.user.memberId.toLowerCase().includes(s)) ||
          (m.membershipNumber && m.membershipNumber.toLowerCase().includes(s))
      );
    }

    res.json(memberships);
  } catch (error) {
    next(error);
  }
};

// @desc    Update single membership by ID
// @route   PATCH /api/v1/admin/memberships/:id
// @access  Private (Admin)
export const updateMembershipById = async (req, res, next) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    const { status, membershipType, validTo, feePaid, paymentStatus, remarks } = req.body;

    if (status) membership.status = status;
    if (membershipType) membership.membershipType = membershipType;
    if (validTo) membership.validTo = new Date(validTo);
    if (feePaid !== undefined) membership.feePaid = feePaid;
    if (paymentStatus) membership.paymentStatus = paymentStatus;
    if (remarks !== undefined) membership.remarks = remarks;

    const updated = await membership.save();
    const populated = await Membership.findById(updated._id).populate('user', 'name email phone memberId');
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in member's membership details
// @route   GET /api/v1/member/membership
// @access  Private (Member)
export const getMyMembership = async (req, res, next) => {
  try {
    const membership = await Membership.findOne({ user: req.user._id }).populate('user', '-password');
    if (!membership) {
      return res.status(404).json({ message: 'Membership record not found' });
    }
    res.json(membership);
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged in member's profile
// @route   PATCH /api/v1/member/profile
// @access  Private (Member)
export const updateMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, phone, address, bloodGroup } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (address) user.address = { ...user.address, ...address };

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

