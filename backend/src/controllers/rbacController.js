import User from '../models/User.js';
import Membership from '../models/Membership.js';
import AuditLog from '../models/AuditLog.js';

// Standard 4 Roles
export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  STAFF_COORDINATOR: 'Staff Coordinator',
  GENERAL_VOLUNTEER: 'General Volunteer',
};

// Available module permissions in the NGO platform
export const ALL_PERMISSIONS = [
  { id: 'members_view', label: 'View Members Directory', category: 'Members' },
  { id: 'members_manage', label: 'Enroll & Manage Members', category: 'Members' },
  { id: 'events_view', label: 'View Cleanup Drives & Events', category: 'Drives & Events' },
  { id: 'events_manage', label: 'Schedule & Manage River Drives', category: 'Drives & Events' },
  { id: 'announcements_view', label: 'View Circulars & Bulletins', category: 'Announcements' },
  { id: 'announcements_manage', label: 'Publish Broadcast Announcements', category: 'Announcements' },
  { id: 'notifications_send', label: 'Dispatch Push Alerts & SMS', category: 'Notifications' },
  { id: 'reports_export', label: 'View & Export Analytical Reports', category: 'Reports' },
  { id: 'website_cms', label: 'Update Website CMS & Live Counters', category: 'Website Content' },
  { id: 'rbac_manage', label: 'Manage Roles & Access Control', category: 'Access Control' },
];

// Helper: Normalize role name
export const normalizeRole = (role) => {
  if (!role) return ROLES.GENERAL_VOLUNTEER;
  const r = role.toLowerCase().replace(/_/g, ' ');
  if (r.includes('super')) return ROLES.SUPER_ADMIN;
  if (r.includes('coord') || r.includes('staff')) return ROLES.STAFF_COORDINATOR;
  if (r.includes('admin')) return ROLES.ADMIN;
  return ROLES.GENERAL_VOLUNTEER;
};

// Helper: Check caller authority level
const getAuthorityLevel = (user) => {
  if (!user) return 0;
  if (user.email === 'admin@gmail.com') return 3; // Super Admin root
  const norm = normalizeRole(user.role);
  if (norm === ROLES.SUPER_ADMIN) return 3;
  if (norm === ROLES.ADMIN) return 2;
  if (norm === ROLES.STAFF_COORDINATOR) return 1;
  return 0; // General Volunteer
};

// Seed initial administrative users if database has none
const ensureSeedUsers = async () => {
  try {
    const adminCount = await User.countDocuments({
      role: { $in: ['admin', 'super_admin', 'Super Admin', 'Admin', 'staff', 'Staff Coordinator'] },
    });
    if (adminCount === 0) {
      await User.create([
        {
          name: 'Dr. K. V. Subba Rao',
          email: 'admin@gmail.com',
          phone: '+91 944 012 3456',
          password: 'password123',
          role: ROLES.SUPER_ADMIN,
          designation: 'President & Executive Trustee',
          permissions: ALL_PERMISSIONS.map((p) => p.id),
          assignedBy: { name: 'Root Genesis', email: 'system@godhavari.org', role: ROLES.SUPER_ADMIN },
          accountStatus: 'Active',
          accessReason: 'Founding NGO Trustee & Chief Executive',
        },
        {
          name: 'Smt. P. Lakshmi Devi',
          email: 'lakshmi.trustee@godhavari.org',
          phone: '+91 883 245 7891',
          password: 'password123',
          role: ROLES.ADMIN,
          designation: 'Riverfront Operations Lead',
          permissions: ['members_view', 'members_manage', 'events_view', 'events_manage', 'announcements_view', 'announcements_manage', 'website_cms', 'reports_export'],
          assignedBy: { name: 'Dr. K. V. Subba Rao', email: 'admin@gmail.com', role: ROLES.SUPER_ADMIN },
          accountStatus: 'Active',
          accessReason: 'Supervises East Godavari riverfront operations and drives',
        },
        {
          name: 'Sri M. Ramu Naidu',
          email: 'ramu.coordinator@godhavari.org',
          phone: '+91 984 801 2345',
          password: 'password123',
          role: ROLES.STAFF_COORDINATOR,
          designation: 'Volunteer Mobilization Officer',
          permissions: ['events_view', 'events_manage', 'announcements_view', 'notifications_send'],
          assignedBy: { name: 'Smt. P. Lakshmi Devi', email: 'lakshmi.trustee@godhavari.org', role: ROLES.ADMIN },
          accountStatus: 'Active',
          accessReason: 'Coordinates weekend ghat cleaning and student volunteer groups',
        },
        {
          name: 'Ananya Sharma',
          email: 'ananya.volunteer@godhavari.org',
          phone: '+91 984 911 2233',
          password: 'password123',
          role: ROLES.GENERAL_VOLUNTEER,
          designation: 'Community Green Steward',
          permissions: ['events_view', 'announcements_view'],
          assignedBy: { name: 'Sri M. Ramu Naidu', email: 'ramu.coordinator@godhavari.org', role: ROLES.STAFF_COORDINATOR },
          accountStatus: 'Active',
          accessReason: 'Active riverbank tree planting steward',
        },
      ]);
    }
  } catch (err) {
    console.warn('Seed initialization error in rbacController:', err.message);
  }
};

// @desc    Get all users with their roles, permissions, and RBAC stats
// @route   GET /api/v1/admin/rbac/overview
// @access  Protected (Admin / Super Admin / Staff Coordinator)
export const getRbacOverview = async (req, res, next) => {
  try {
    await ensureSeedUsers();

    // Fetch all users to display in the centralized User Management table
    const users = await User.find({}).sort({ createdAt: -1 });

    const formattedUsers = users.map((u) => {
      const normRole = normalizeRole(u.role);
      return {
        _id: u._id,
        memberId: u.memberId || 'N/A',
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: normRole,
        designation: u.designation || 'NGO Member',
        permissions: Array.isArray(u.permissions) && u.permissions.length > 0 ? u.permissions : getDefaultPermissionsForRole(normRole),
        assignedBy: u.assignedBy?.name ? u.assignedBy : { name: 'Super Admin', email: 'admin@gmail.com', role: ROLES.SUPER_ADMIN },
        accessGrantedDate: u.accessGrantedDate || u.createdAt || new Date(),
        accessExpiryDate: u.accessExpiryDate || null,
        accountStatus: u.accountStatus || (u.isActive ? 'Active' : 'Inactive'),
        accessReason: u.accessReason || 'Standard platform operational access',
        avatar: u.avatar || '',
        createdAt: u.createdAt,
      };
    });

    // Compute KPI Counts
    const stats = {
      totalUsers: formattedUsers.length,
      superAdminCount: formattedUsers.filter((u) => u.role === ROLES.SUPER_ADMIN).length,
      adminCount: formattedUsers.filter((u) => u.role === ROLES.ADMIN).length,
      staffCoordinatorCount: formattedUsers.filter((u) => u.role === ROLES.STAFF_COORDINATOR).length,
      generalVolunteerCount: formattedUsers.filter((u) => u.role === ROLES.GENERAL_VOLUNTEER).length,
      activeUsers: formattedUsers.filter((u) => u.accountStatus === 'Active').length,
      pendingRequests: formattedUsers.filter((u) => u.accountStatus === 'Pending').length,
    };

    // Include caller authority info
    const callerLevel = getAuthorityLevel(req.user);
    const callerRole = req.user?.email === 'admin@gmail.com' ? ROLES.SUPER_ADMIN : normalizeRole(req.user?.role);

    res.json({
      success: true,
      stats,
      users: formattedUsers,
      callerInfo: {
        role: callerRole,
        authorityLevel: callerLevel,
        canAssignSuperAdmin: callerLevel >= 3,
        canAssignAdmin: callerLevel >= 3,
        canAssignStaff: callerLevel >= 2,
        canAssignVolunteer: callerLevel >= 2,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign or Update User Access (Role, Permissions, Expiry, Reason)
// @route   POST /api/v1/admin/rbac/assign
// @access  Protected (Admin / Super Admin)
export const assignUserAccess = async (req, res, next) => {
  try {
    const {
      userId,
      email,
      name,
      phone,
      role,
      permissions,
      accessStartDate,
      accessExpiryDate,
      accessReason,
      accountStatus,
    } = req.body;

    const callerLevel = getAuthorityLevel(req.user);
    const targetRole = normalizeRole(role);

    // 1. Strict Authority Validation (Prevent Privilege Escalation)
    if (callerLevel < 2) {
      return res.status(403).json({
        message: 'Security Violation: Staff Coordinators and General Volunteers cannot grant or modify roles.',
      });
    }

    // Admin (level 2) cannot assign Super Admin or Admin
    if (callerLevel === 2 && (targetRole === ROLES.SUPER_ADMIN || targetRole === ROLES.ADMIN)) {
      return res.status(403).json({
        message: 'Security Violation: Administrators can only assign Staff Coordinator or General Volunteer roles.',
      });
    }

    // 2. Find or Create User
    let targetUser = null;
    if (userId) {
      targetUser = await User.findById(userId);
    } else if (email) {
      targetUser = await User.findOne({ email: email.toLowerCase().trim() });
    }

    if (!targetUser) {
      // Create new user if not already in system
      if (!name || !email) {
        return res.status(400).json({ message: 'User name and valid email are required to grant access.' });
      }
      targetUser = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone || '+91 944 000 0000',
        password: 'password123', // Default temporary credentials
        designation: targetRole === ROLES.STAFF_COORDINATOR ? 'Staff Coordinator' : targetRole === ROLES.ADMIN ? 'Administrator' : 'Volunteer',
      });
    }

    // 3. Prevent modifying Super Admin unless caller is Super Admin
    const targetCurrentRole = normalizeRole(targetUser.role);
    if (targetCurrentRole === ROLES.SUPER_ADMIN && callerLevel < 3) {
      return res.status(403).json({
        message: 'Security Violation: Only Super Admin can modify or reassign another Super Admin account.',
      });
    }

    // 4. Prevent demoting the root founding administrator (admin@gmail.com)
    if (targetUser.email === 'admin@gmail.com' && targetRole !== ROLES.SUPER_ADMIN) {
      return res.status(400).json({
        message: 'Safety Lock: The root founding Executive Super Admin cannot be demoted.',
      });
    }

    // 5. Update user fields
    targetUser.role = targetRole;
    targetUser.permissions = Array.isArray(permissions) ? permissions : getDefaultPermissionsForRole(targetRole);
    targetUser.assignedBy = {
      name: req.user?.name || 'Dr. K. V. Subba Rao',
      email: req.user?.email || 'admin@gmail.com',
      role: req.user?.email === 'admin@gmail.com' ? ROLES.SUPER_ADMIN : normalizeRole(req.user?.role),
    };
    targetUser.accessGrantedDate = accessStartDate ? new Date(accessStartDate) : new Date();
    targetUser.accessExpiryDate = accessExpiryDate ? new Date(accessExpiryDate) : null;
    targetUser.accessReason = accessReason || 'Administrative assignment';
    if (accountStatus) {
      targetUser.accountStatus = accountStatus;
      targetUser.isActive = accountStatus === 'Active';
    }

    await targetUser.save();

    // 6. Security Audit Log
    try {
      await AuditLog.create({
        admin: req.user?.name || 'Dr. K. V. Subba Rao',
        adminEmail: req.user?.email || 'admin@gmail.com',
        action: `Assigned role "${targetRole}" to ${targetUser.name} (${targetUser.email}) with ${targetUser.permissions.length} granular permissions. Expiry: ${targetUser.accessExpiryDate ? new Date(targetUser.accessExpiryDate).toLocaleDateString() : 'Permanent'}.`,
        category: 'Security',
        severity: targetRole === ROLES.SUPER_ADMIN || targetRole === ROLES.ADMIN ? 'warning' : 'info',
        metadata: {
          targetUserId: targetUser._id,
          targetEmail: targetUser.email,
          roleAssigned: targetRole,
          permissionsGranted: targetUser.permissions,
          accessReason: targetUser.accessReason,
        },
      });
    } catch (auditErr) {
      console.warn('Audit logging warning:', auditErr.message);
    }

    res.json({
      success: true,
      message: `Access successfully updated: ${targetUser.name} is now assigned as "${targetRole}".`,
      user: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetRole,
        permissions: targetUser.permissions,
        assignedBy: targetUser.assignedBy,
        accessGrantedDate: targetUser.accessGrantedDate,
        accessExpiryDate: targetUser.accessExpiryDate,
        accountStatus: targetUser.accountStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update User Account Status (Activate, Deactivate, Revoke)
// @route   PATCH /api/v1/admin/rbac/users/:id/status
// @access  Protected (Admin / Super Admin)
export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const callerLevel = getAuthorityLevel(req.user);
    if (callerLevel < 2) {
      return res.status(403).json({ message: 'Access denied: Insufficient administrative privileges.' });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found in registry.' });
    }

    const targetRole = normalizeRole(targetUser.role);

    // Prevent modifying Super Admin if caller is not Super Admin
    if (targetRole === ROLES.SUPER_ADMIN && callerLevel < 3) {
      return res.status(403).json({ message: 'Security Block: Only Super Admin can change Super Admin status.' });
    }

    // Prevent deactivating own account
    if (targetUser._id.toString() === req.user?._id?.toString()) {
      return res.status(400).json({ message: 'Action disallowed: You cannot deactivate your own active session account.' });
    }

    const previousStatus = targetUser.accountStatus || 'Active';
    targetUser.accountStatus = status;
    targetUser.isActive = status === 'Active';

    // If revoking or suspending, deactivate account & suspend linked membership
    if (status === 'Inactive' || status === 'Revoked' || status === 'Suspended') {
      targetUser.accountStatus = 'Inactive';
      targetUser.isActive = false;
      targetUser.accessReason = reason || 'Account suspended by administrator';
    }

    await targetUser.save();

    if (targetUser.accountStatus === 'Inactive') {
      await Membership.findOneAndUpdate(
        { user: targetUser._id },
        { status: 'Suspended', ...(reason ? { remarks: reason } : {}) }
      );
    } else if (targetUser.accountStatus === 'Active') {
      await Membership.findOneAndUpdate(
        { user: targetUser._id, status: 'Suspended' },
        { status: 'Active' }
      );
    }

    // Security Audit Log
    try {
      await AuditLog.create({
        admin: req.user?.name || 'Dr. K. V. Subba Rao',
        adminEmail: req.user?.email || 'admin@gmail.com',
        action: `Changed account status for ${targetUser.name} (${targetUser.email}) from "${previousStatus}" to "${targetUser.accountStatus}".`,
        category: 'Security',
        severity: status === 'Inactive' ? 'danger' : 'success',
        metadata: {
          targetUserId: targetUser._id,
          targetEmail: targetUser.email,
          newStatus: targetUser.accountStatus,
          reason,
        },
      });
    } catch (auditErr) {
      console.warn('Audit log write error:', auditErr.message);
    }

    res.json({
      success: true,
      message: `Account status for ${targetUser.name} changed to ${targetUser.accountStatus}.`,
      status: targetUser.accountStatus,
    });
  } catch (error) {
    next(error);
  }
};

// Default permissions preset helper
export const getDefaultPermissionsForRole = (role) => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return ALL_PERMISSIONS.map((p) => p.id);
    case ROLES.ADMIN:
      return [
        'members_view',
        'members_manage',
        'events_view',
        'events_manage',
        'announcements_view',
        'announcements_manage',
        'notifications_send',
        'reports_export',
        'website_cms',
      ];
    case ROLES.STAFF_COORDINATOR:
      return ['events_view', 'events_manage', 'announcements_view', 'announcements_manage', 'notifications_send', 'members_view'];
    case ROLES.GENERAL_VOLUNTEER:
    default:
      return ['events_view', 'announcements_view'];
  }
};

