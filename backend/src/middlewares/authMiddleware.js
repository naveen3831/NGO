import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Membership from '../models/Membership.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && typeof req.query.token === 'string' && req.query.token.trim()) {
    token = req.query.token.trim();
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_ngo_jwt_token_key_2026_xyz');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found or deleted' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, authorization token missing' });
};

export const requireAdmin = (req, res, next) => {
  const adminRoles = [
    'admin',
    'super_admin',
    'staff_coordinator',
    'staff',
    'Super Admin',
    'Admin',
    'Staff Coordinator',
    'General Volunteer',
    'volunteer',
  ];
  if (req.user && adminRoles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Administrator privileges required' });
  }
};

export const requireSuperAdmin = (req, res, next) => {
  const isSuper =
    req.user &&
    (req.user.role === 'super_admin' ||
      req.user.role === 'Super Admin' ||
      req.user.email === 'admin@gmail.com');
  if (isSuper) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Super Admin privileges required' });
  }
};

export const requireMember = async (req, res, next) => {
  if (!req.user || !['admin', 'member', 'volunteer', 'staff', 'general_volunteer', 'General Volunteer'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: Active NGO Member account required' });
  }

  if (req.user.email !== 'admin@gmail.com') {
    const membership = await Membership.findOne({ user: req.user._id }).lean();
    const mStatus = membership?.status || 'Pending';
    if (
      req.user.isActive === false ||
      req.user.accountStatus?.toLowerCase() === 'inactive' ||
      mStatus === 'Suspended'
    ) {
      return res.status(403).json({
        code: 'ACCOUNT_SUSPENDED',
        suspended: true,
        message: 'Your account has been suspended. Please contact the administrator.',
        reason: membership?.remarks || req.user.accessReason || '',
      });
    }
    if (['member', 'volunteer', 'general_volunteer', 'General Volunteer'].includes(req.user.role)) {
      if (
        req.user.accountStatus !== 'Active' ||
        !['Active', 'Approved'].includes(mStatus)
      ) {
        return res.status(403).json({
          message: 'Account pending administrator approval or inactive.',
        });
      }
    }
  }

  next();
};

export const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_ngo_jwt_token_key_2026_xyz');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Continue without req.user
    }
  }
  next();
};
