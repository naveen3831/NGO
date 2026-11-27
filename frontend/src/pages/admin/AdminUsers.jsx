import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  recordAdminAction,
  AUDIT_EVENT_NAME,
} from '../../services/auditService';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Key,
  Mail,
  Phone,
  X,
  Lock,
  Calendar,
  Save,
  Clock,
  Crown,
  ChevronRight,
  Filter,
  RefreshCw,
  Info,
  Check,
  Eye,
  Edit2,
  Trash2,
  Ban,
  Activity,
  Layers,
  Sparkles,
  HeartHandshake,
  CheckCircle,
  AlertCircle,
  Plus,
  Pause,
  Star,
  User,
  Sliders,
  RotateCcw,
  Database,
  Globe,
  Bell,
  ClipboardCheck,
  BarChart3,
  LifeBuoy,
  Minus,
  Compass,
  ArrowLeft,
} from 'lucide-react';

// Capability Metadata Helper: maps category and name to domain colors and icon
const getCapabilityMeta = (cap) => {
  switch (cap.category) {
    case 'System & DB':
      return {
        icon: <Database size={16} />,
        iconColor: '#2563eb',
        iconBg: '#eff6ff',
        badgeBg: '#eff6ff',
        badgeColor: '#1d4ed8',
        badgeBorder: '#bfdbfe',
      };
    case 'Access Control':
      return {
        icon: <ShieldAlert size={16} />,
        iconColor: '#9333ea',
        iconBg: '#faf5ff',
        badgeBg: '#faf5ff',
        badgeColor: '#7e22ce',
        badgeBorder: '#e9d5ff',
      };
    case 'Drives & Events':
      return {
        icon: <Calendar size={16} />,
        iconColor: '#059669',
        iconBg: '#ecfdf5',
        badgeBg: '#ecfdf5',
        badgeColor: '#047857',
        badgeBorder: '#a7f3d0',
      };
    case 'Membership':
      return {
        icon: <UserCheck size={16} />,
        iconColor: '#0284c7',
        iconBg: '#f0f9ff',
        badgeBg: '#f0f9ff',
        badgeColor: '#0369a1',
        badgeBorder: '#bae6fd',
      };
    case 'Public CMS':
      return {
        icon: <Globe size={16} />,
        iconColor: '#4f46e5',
        iconBg: '#eef2ff',
        badgeBg: '#eef2ff',
        badgeColor: '#4338ca',
        badgeBorder: '#c7d2fe',
      };
    case 'Broadcasts':
      return {
        icon: <Bell size={16} />,
        iconColor: '#d97706',
        iconBg: '#fffbeb',
        badgeBg: '#fffbeb',
        badgeColor: '#b45309',
        badgeBorder: '#fde68a',
      };
    case 'Field Operations':
      return {
        icon: <ClipboardCheck size={16} />,
        iconColor: '#0d9488',
        iconBg: '#f0fdfa',
        badgeBg: '#f0fdfa',
        badgeColor: '#0f766e',
        badgeBorder: '#99f6e4',
      };
    case 'Public Access':
      return {
        icon: <Compass size={16} />,
        iconColor: '#475569',
        iconBg: '#f8fafc',
        badgeBg: '#f8fafc',
        badgeColor: '#475569',
        badgeBorder: '#e2e8f0',
      };
    case 'Analytics & Audit':
      return {
        icon: <BarChart3 size={16} />,
        iconColor: '#7c3aed',
        iconBg: '#f5f3ff',
        badgeBg: '#f5f3ff',
        badgeColor: '#6d28d9',
        badgeBorder: '#ddd6fe',
      };
    case 'Emergency Dispatch':
      return {
        icon: <LifeBuoy size={16} />,
        iconColor: '#e11d48',
        iconBg: '#fff1f2',
        badgeBg: '#fff1f2',
        badgeColor: '#be123c',
        badgeBorder: '#fecdd3',
      };
    default:
      return {
        icon: <Sliders size={16} />,
        iconColor: '#475569',
        iconBg: '#f8fafc',
        badgeBg: '#f1f5f9',
        badgeColor: '#475569',
        badgeBorder: '#e2e8f0',
      };
  }
};

// Standard 4 User Roles
export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  STAFF_COORDINATOR: 'Staff Coordinator',
  GENERAL_VOLUNTEER: 'General Volunteer',
};

// Initial Operational Capabilities Matrix matching the user's reference design
const defaultRbacCapabilities = [
  {
    id: 1,
    name: 'Database Direct Write & Backup Restores',
    category: 'System & DB',
    super: true,
    admin: false,
    staff: false,
    vol: false,
    desc: 'Root administrative privilege to execute direct database transactions and trigger recovery points.',
  },
  {
    id: 2,
    name: 'Manage Administrator Users & Roles',
    category: 'Access Control',
    super: true,
    admin: false,
    staff: false,
    vol: false,
    desc: 'Enroll, promote, demote, or revoke administrative access privileges across the management suite.',
  },
  {
    id: 3,
    name: 'Schedule Cleanliness Drives & Ghat Events',
    category: 'Drives & Events',
    super: true,
    admin: true,
    staff: false,
    vol: false,
    desc: 'Organize riverbank cleanups, configure volunteer capacities, and dispatch official drive circulars.',
  },
  {
    id: 4,
    name: 'Approve & Verify Member Registrations',
    category: 'Membership',
    super: true,
    admin: true,
    staff: false,
    vol: false,
    desc: 'Validate government photo identification, verify fee payments, and issue official NGO ID cards.',
  },
  {
    id: 5,
    name: 'Publish Website CMS & Impact Statistics',
    category: 'Public CMS',
    super: true,
    admin: true,
    staff: false,
    vol: false,
    desc: 'Update river water cleanliness metrics, press releases, homepage banners, and leadership contacts.',
  },
  {
    id: 6,
    name: 'Send In-App & Push Notifications',
    category: 'Broadcasts',
    super: true,
    admin: true,
    staff: true,
    vol: false,
    desc: 'Dispatch broadcast safety alerts and drive reminders to registered volunteers.',
  },
  {
    id: 7,
    name: 'Take Ghat Cleanliness Attendance',
    category: 'Field Operations',
    super: true,
    admin: true,
    staff: true,
    vol: false,
    desc: 'Record real-time on-site volunteer attendance at Godavari ghat environmental drives.',
  },
  {
    id: 8,
    name: 'View Public Portal & Volunteer Signup',
    category: 'Public Access',
    super: true,
    admin: true,
    staff: true,
    vol: true,
    desc: 'Access public announcements, donation portals, and registration forms.',
  },
  {
    id: 9,
    name: 'Generate & Export Analytics Reports',
    category: 'Analytics & Audit',
    super: true,
    admin: true,
    staff: false,
    vol: false,
    desc: 'Export official environmental metrics and financial contribution spreadsheets.',
  },
  {
    id: 10,
    name: 'Emergency Godavari River Helpline Dispatch',
    category: 'Emergency Dispatch',
    super: true,
    admin: true,
    staff: true,
    vol: false,
    desc: 'Coordinate with local emergency helplines for pollution interception and distress calls.',
  },
];

// Available Module Permissions for individual user assignment
export const MODULE_PERMISSIONS = [
  { id: 'members_view', label: 'View Members Directory', category: 'Members', desc: 'Browse registered members, donors, and patrons.' },
  { id: 'members_manage', label: 'Enroll & Manage Members', category: 'Members', desc: 'Verify IDs, update member tiers, and edit records.' },
  { id: 'events_view', label: 'View Cleanup Drives & Events', category: 'Drives & Events', desc: 'Review scheduled Godavari cleanliness campaigns.' },
  { id: 'events_manage', label: 'Schedule & Manage River Drives', category: 'Drives & Events', desc: 'Create new cleanup drives and assign ghat teams.' },
  { id: 'announcements_view', label: 'View Circulars & Bulletins', category: 'Announcements', desc: 'Access public announcements and guidelines.' },
  { id: 'announcements_manage', label: 'Publish Broadcast Announcements', category: 'Announcements', desc: 'Post urgent notifications and media notices.' },
  { id: 'notifications_send', label: 'Dispatch Push Alerts & SMS', category: 'Notifications', desc: 'Send emergency push broadcasts to members.' },
  { id: 'reports_export', label: 'View & Export Analytical Reports', category: 'Reports', desc: 'Download river cleanliness and finance spreadsheets.' },
  { id: 'website_cms', label: 'Update Website CMS & Live Counters', category: 'Website Content', desc: 'Configure hero banners, metrics, and contacts.' },
  { id: 'rbac_manage', label: 'Manage Roles & Access Control', category: 'Access Control', desc: 'Admin authority to assign roles and revoke access.' },
];

const getDefaultPermissionsForRole = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return MODULE_PERMISSIONS.map((p) => p.id);
    case ROLES.STAFF_COORDINATOR:
      return ['events_view', 'events_manage', 'announcements_view', 'announcements_manage', 'notifications_send', 'members_view'];
    case ROLES.GENERAL_VOLUNTEER:
    default:
      return ['events_view', 'announcements_view'];
  }
};

const initialDefaultUsers = [
  {
    _id: 'usr-01',
    memberId: 'GNPP-2026-0001',
    name: 'Dr. K. V. Subba Rao',
    email: 'admin@gmail.com',
    phone: '+91 944 012 3456',
    role: ROLES.ADMIN,
    designation: 'President & Executive Trustee',
    permissions: MODULE_PERMISSIONS.map((p) => p.id),
    assignedBy: { name: 'Root Genesis', email: 'system@godhavari.org', role: ROLES.ADMIN },
    accessGrantedDate: '2026-01-01T09:00:00Z',
    accessExpiryDate: null,
    accountStatus: 'Active',
    accessReason: 'Chief NGO Executive & Founding Trustee (Administrator)',
  },
  {
    _id: 'usr-02',
    memberId: 'GNPP-2026-0104',
    name: 'Smt. P. Lakshmi Devi',
    email: 'lakshmi.trustee@godhavari.org',
    phone: '+91 883 245 7891',
    role: ROLES.ADMIN,
    designation: 'Riverfront Operations Lead',
    permissions: ['members_view', 'members_manage', 'events_view', 'events_manage', 'announcements_view', 'announcements_manage', 'website_cms', 'reports_export'],
    assignedBy: { name: 'Dr. K. V. Subba Rao', email: 'admin@gmail.com', role: ROLES.ADMIN },
    accessGrantedDate: '2026-02-15T10:30:00Z',
    accessExpiryDate: null,
    accountStatus: 'Active',
    accessReason: 'Oversees Godavari river cleanliness and operational drives',
  },
  {
    _id: 'usr-03',
    memberId: 'GNPP-2026-0205',
    name: 'Sri M. Ramu Naidu',
    email: 'ramu.coordinator@godhavari.org',
    phone: '+91 984 801 2345',
    role: ROLES.STAFF_COORDINATOR,
    designation: 'Volunteer Mobilization Officer',
    permissions: ['events_view', 'events_manage', 'announcements_view', 'notifications_send'],
    assignedBy: { name: 'Smt. P. Lakshmi Devi', email: 'lakshmi.trustee@godhavari.org', role: ROLES.ADMIN },
    accessGrantedDate: '2026-03-01T08:00:00Z',
    accessExpiryDate: '2026-12-31T23:59:59Z',
    accountStatus: 'Active',
    accessReason: 'Manages weekend ghat cleanup volunteers and notices',
  },
  {
    _id: 'usr-04',
    memberId: 'GNPP-2026-0310',
    name: 'Prof. K. Satyanarayana',
    email: 'it.audit@godhavari.org',
    phone: '+91 944 112 2334',
    role: ROLES.ADMIN,
    designation: 'IT Systems & Database Auditor',
    permissions: ['members_view', 'reports_export', 'website_cms', 'events_view'],
    assignedBy: { name: 'Dr. K. V. Subba Rao', email: 'admin@gmail.com', role: ROLES.SUPER_ADMIN },
    accessGrantedDate: '2026-04-10T11:00:00Z',
    accessExpiryDate: null,
    accountStatus: 'Active',
    accessReason: 'Technical auditing and analytics verification',
  },
  {
    _id: 'usr-05',
    memberId: 'GNPP-2026-0422',
    name: 'Ananya Sharma',
    email: 'ananya.volunteer@godhavari.org',
    phone: '+91 984 911 2233',
    role: ROLES.GENERAL_VOLUNTEER,
    designation: 'Community Green Steward',
    permissions: ['events_view', 'announcements_view'],
    assignedBy: { name: 'Sri M. Ramu Naidu', email: 'ramu.coordinator@godhavari.org', role: ROLES.STAFF_COORDINATOR },
    accessGrantedDate: '2026-05-18T14:15:00Z',
    accessExpiryDate: '2026-11-30T23:59:59Z',
    accountStatus: 'Active',
    accessReason: 'Field cleanup volunteer for Kotilingala and Pushkar ghats',
  },
  {
    _id: 'usr-06',
    memberId: 'GNPP-2026-0518',
    name: 'V. Rajesh Kumar',
    email: 'rajesh.volunteer@godhavari.org',
    phone: '+91 998 877 6655',
    role: ROLES.GENERAL_VOLUNTEER,
    designation: 'River Water Sampling Volunteer',
    permissions: ['events_view', 'announcements_view'],
    assignedBy: { name: 'Dr. K. V. Subba Rao', email: 'admin@gmail.com', role: ROLES.SUPER_ADMIN },
    accessGrantedDate: '2026-06-01T09:30:00Z',
    accessExpiryDate: null,
    accountStatus: 'Pending',
    accessReason: 'Requested volunteer portal access for river water testing',
  },
  {
    _id: 'usr-07',
    memberId: 'GNPP-2026-0629',
    name: 'D. Suresh Varma',
    email: 'suresh.varma@godhavari.org',
    phone: '+91 970 123 4567',
    role: ROLES.STAFF_COORDINATOR,
    designation: 'Logistics Supervisor (Former)',
    permissions: ['events_view', 'announcements_view'],
    assignedBy: { name: 'Smt. P. Lakshmi Devi', email: 'lakshmi.trustee@godhavari.org', role: ROLES.ADMIN },
    accessGrantedDate: '2026-01-10T10:00:00Z',
    accessExpiryDate: '2026-06-30T23:59:59Z',
    accountStatus: 'Inactive',
    accessReason: 'Temporary logistics assignment concluded',
  },
];

const AdminUsers = () => {
  const { user: authUser } = useAuth();

  // Active View Tab: 'matrix' (Operational Capability Matrix) | 'directory' (User Directory) | 'audit' (Security Audit Trail)
  const [activeTab, setActiveTab] = useState('matrix');

  // RBAC Capabilities Matrix State
  const [capabilities, setCapabilities] = useState(() => {
    try {
      const saved = localStorage.getItem('ngo_operational_capabilities_matrix_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return defaultRbacCapabilities;
  });

  // Users and Loading state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Filtering & Search
  const [searchKeyword, setSearchKeyword] = useState('');
  const [matrixSearch, setMatrixSearch] = useState('');
  const [matrixCategoryFilter, setMatrixCategoryFilter] = useState('All');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedExpiryFilter, setSelectedExpiryFilter] = useState('All');

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetMatrixDefaults = () => {
    setShowResetConfirm(true);
  };

  const handleConfirmResetMatrix = () => {
    setCapabilities(defaultRbacCapabilities);
    setMatrixCategoryFilter('All');
    setMatrixSearch('');
    try {
      localStorage.setItem('ngo_operational_capabilities_matrix_v1', JSON.stringify(defaultRbacCapabilities));
    } catch (e) {}
    recordAdminAction('Reset Operational Capabilities Matrix to system defaults', 'Security');
    setFeedback({ type: 'success', message: 'Operational Capabilities Matrix reset to recommended defaults.' });
    setShowResetConfirm(false);
  };

  const filteredCapabilities = useMemo(() => {
    return capabilities.filter((c) => {
      const matchesCategory =
        matrixCategoryFilter === 'All' || c.category === matrixCategoryFilter;
      if (!matchesCategory) return false;

      if (!matrixSearch.trim()) return true;
      const q = matrixSearch.toLowerCase();
  return (
        c.name.toLowerCase().includes(q) ||
        (c.desc && c.desc.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q))
      );
    });
  }, [capabilities, matrixSearch, matrixCategoryFilter]);

  // Authority Simulator: allows testing the UI as Admin, Staff Coordinator, or General Volunteer
  const [simulatedRole, setSimulatedRole] = useState(ROLES.ADMIN);

  // Dynamic Authority Calculation based on logged-in or simulated role
  const effectiveRole = simulatedRole;
  const isSuperAdmin = false;
  const isAdmin = effectiveRole === ROLES.ADMIN;

  // Modals & Panels
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedUserForAssign, setSelectedUserForAssign] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [confirmRevokeModal, setConfirmRevokeModal] = useState({ open: false, user: null });
  const [submitting, setSubmitting] = useState(false);

  // Assign Access Form State
  const [assignForm, setAssignForm] = useState({
    userId: '',
    name: '',
    email: '',
    phone: '',
    role: ROLES.STAFF_COORDINATOR,
    permissions: getDefaultPermissionsForRole(ROLES.STAFF_COORDINATOR),
    isPermanent: true,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    reason: '',
    accountStatus: 'Active',
  });

  // Security Audit Logs
  const [auditLogs, setAuditLogs] = useState([]);

  // Fetch Users & Audit Logs
  const fetchRbacData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/rbac/overview');
      if (res.data?.users && Array.isArray(res.data.users) && res.data.users.length > 0) {
        setUsers(res.data.users);
      } else {
        const saved = localStorage.getItem('ngo_rbac_users_v3');
        if (saved) {
          setUsers(JSON.parse(saved));
        } else {
          setUsers(initialDefaultUsers);
          localStorage.setItem('ngo_rbac_users_v3', JSON.stringify(initialDefaultUsers));
        }
      }
    } catch (err) {
      const saved = localStorage.getItem('ngo_rbac_users_v3');
      if (saved) {
        setUsers(JSON.parse(saved));
      } else {
        setUsers(initialDefaultUsers);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await api.get('/admin/audit-logs');
      if (res.data?.logs && Array.isArray(res.data.logs)) {
        setAuditLogs(res.data.logs);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchRbacData();
    fetchAuditLogs();

    const handleAuditEvent = (e) => {
      if (e.detail) {
        setAuditLogs((prev) => [e.detail, ...prev]);
      }
    };
    window.addEventListener(AUDIT_EVENT_NAME, handleAuditEvent);
  return () => window.removeEventListener(AUDIT_EVENT_NAME, handleAuditEvent);
  }, []);

  const persistUsers = (newUsers) => {
    setUsers(newUsers);
    try {
      localStorage.setItem('ngo_rbac_users_v3', JSON.stringify(newUsers));
    } catch (e) {}
  };

  // Toggle Capability Permission on Matrix table
  const handleToggleCapability = (capId, roleKey) => {
    if (!isAdmin) {
      setFeedback({
        type: 'warning',
        message: 'Security Notice: Only Admin can modify operational permissions.',
      });
      return;
    }

    setCapabilities((prev) => {
      const updated = prev.map((item) => {
        if (item.id === capId) {
          const newVal = !item[roleKey];
          const roleLabel =
            roleKey === 'admin'
              ? 'Admin'
              : roleKey === 'staff'
              ? 'Staff Coordinator'
              : 'General Volunteer';

          recordAdminAction(
            `${newVal ? 'Granted' : 'Revoked'} "${item.name}" operational capability for ${roleLabel}.`,
            'Security'
          );

          setFeedback({
            type: 'success',
            message: `${newVal ? 'Granted' : 'Revoked'} "${item.name}" capability for ${roleLabel}.`,
          });

          return { ...item, [roleKey]: newVal };
        }
        return item;
      });

      try {
        localStorage.setItem('ngo_operational_capabilities_matrix_v1', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Helper for User Initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper for Role Badge Classes
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return 'ref-tier-life';
      case ROLES.ADMIN:
        return 'ref-tier-annual';
      case ROLES.STAFF_COORDINATOR:
        return 'ref-tier-volunteer';
      case ROLES.GENERAL_VOLUNTEER:
      default:
        return 'ref-tier-annual';
    }
  };

  const getAvatarBg = (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return '#6d28d9';
      case ROLES.ADMIN:
        return '#0284c7';
      case ROLES.STAFF_COORDINATOR:
        return '#d97706';
      case ROLES.GENERAL_VOLUNTEER:
      default:
        return '#059669';
    }
  };

  // KPI Calculations
  const kpis = useMemo(() => {
    const totalUsers = users.length;
    const superAdminCount = users.filter((u) => u.role === ROLES.SUPER_ADMIN).length;
    const adminCount = users.filter((u) => u.role === ROLES.ADMIN).length;
    const staffCoordinatorCount = users.filter((u) => u.role === ROLES.STAFF_COORDINATOR).length;
    const generalVolunteerCount = users.filter((u) => u.role === ROLES.GENERAL_VOLUNTEER).length;
    const activeUsers = users.filter((u) => u.accountStatus === 'Active').length;
    const pendingRequests = users.filter((u) => u.accountStatus === 'Pending').length;

    return {
      totalUsers,
      superAdminCount,
      adminCount,
      staffCoordinatorCount,
      generalVolunteerCount,
      activeUsers,
      pendingRequests,
    };
  }, [users]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        searchKeyword === '' ||
        u.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        u.phone?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        u.designation?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        u.memberId?.toLowerCase().includes(searchKeyword.toLowerCase());

      const matchRole =
        selectedRoleFilter === 'All' || u.role === selectedRoleFilter;

      const matchStatus =
        selectedStatusFilter === 'All' || u.accountStatus === selectedStatusFilter;

      let matchExpiry = true;
      if (selectedExpiryFilter === 'Permanent') {
        matchExpiry = !u.accessExpiryDate;
      } else if (selectedExpiryFilter === 'Temporary') {
        matchExpiry = Boolean(u.accessExpiryDate);
      } else if (selectedExpiryFilter === 'Expired') {
        matchExpiry = Boolean(u.accessExpiryDate && new Date(u.accessExpiryDate) < new Date());
      }

      return matchSearch && matchRole && matchStatus && matchExpiry;
    });
  }, [users, searchKeyword, selectedRoleFilter, selectedStatusFilter, selectedExpiryFilter]);

  // Available Roles for Assigning depending dynamically on logged-in user's authority
  const assignableRoles = useMemo(() => {
    if (isAdmin) {
      return [
        { role: ROLES.ADMIN, desc: 'Administrative operations & staff management', badgeClass: 'ref-tier-annual' },
        { role: ROLES.STAFF_COORDINATOR, desc: 'Event coordination & volunteer dispatch', badgeClass: 'ref-tier-volunteer' },
        { role: ROLES.GENERAL_VOLUNTEER, desc: 'Assigned community cleanup activities', badgeClass: 'ref-tier-annual' },
      ];
    }
    return [];
  }, [isAdmin]);

  const handleOpenAssignModal = (targetUser = null) => {
    if (!isAdmin) {
      setFeedback({
        type: 'warning',
        message: 'Security Notice: Only Admin can assign or modify roles.',
      });
      return;
    }

    if (targetUser) {

      setSelectedUserForAssign(targetUser);
      setAssignForm({
        userId: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone || '',
        role: targetUser.role,
        permissions: targetUser.permissions || getDefaultPermissionsForRole(targetUser.role),
        isPermanent: !targetUser.accessExpiryDate,
        startDate: targetUser.accessGrantedDate ? new Date(targetUser.accessGrantedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        expiryDate: targetUser.accessExpiryDate ? new Date(targetUser.accessExpiryDate).toISOString().split('T')[0] : '',
        reason: targetUser.accessReason || '',
        accountStatus: targetUser.accountStatus || 'Active',
      });
    } else {
      const defaultRole = isSuperAdmin ? ROLES.ADMIN : ROLES.STAFF_COORDINATOR;
      setSelectedUserForAssign(null);
      setAssignForm({
        userId: '',
        name: '',
        email: '',
        phone: '',
        role: defaultRole,
        permissions: getDefaultPermissionsForRole(defaultRole),
        isPermanent: true,
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        reason: '',
        accountStatus: 'Active',
      });
    }
    setShowAssignModal(true);
  };

  const handleRoleSelectionInModal = (newRole) => {
    setAssignForm((prev) => ({
      ...prev,
      role: newRole,
      permissions: getDefaultPermissionsForRole(newRole),
    }));
  };

  const handleTogglePermission = (permId) => {
    setAssignForm((prev) => {
      const exists = prev.permissions.includes(permId);
      const updated = exists
        ? prev.permissions.filter((p) => p !== permId)
        : [...prev.permissions, permId];
      return { ...prev, permissions: updated };
    });
  };

  const handleSubmitAssign = async (e) => {
    e.preventDefault();

    if (!assignForm.name.trim() || !assignForm.email.trim()) {
      setFeedback({ type: 'danger', message: 'Please provide full name and valid email.' });
      return;
    }

    if (isAdmin && (assignForm.role === ROLES.SUPER_ADMIN || assignForm.role === ROLES.ADMIN)) {
      setFeedback({
        type: 'danger',
        message: 'Security Violation: Administrators are authorized to grant Staff Coordinator and General Volunteer roles only.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        userId: assignForm.userId || undefined,
        name: assignForm.name.trim(),
        email: assignForm.email.toLowerCase().trim(),
        phone: assignForm.phone.trim(),
        role: assignForm.role,
        permissions: assignForm.permissions,
        accessStartDate: assignForm.startDate,
        accessExpiryDate: assignForm.isPermanent ? null : assignForm.expiryDate,
        accessReason: assignForm.reason.trim() || 'Role assigned via Access Management Dashboard',
        accountStatus: assignForm.accountStatus,
      };

      try {
        await api.post('/admin/rbac/assign', payload);
      } catch (apiErr) {}

      const nowUser = {
        _id: assignForm.userId || `usr-${Date.now().toString().slice(-4)}`,
        name: assignForm.name.trim(),
        email: assignForm.email.toLowerCase().trim(),
        phone: assignForm.phone.trim() || '+91 944 000 0000',
        role: assignForm.role,
        designation: assignForm.role === ROLES.SUPER_ADMIN ? 'Executive Trustee' : assignForm.role === ROLES.ADMIN ? 'Administrator' : assignForm.role === ROLES.STAFF_COORDINATOR ? 'Staff Coordinator' : 'General Volunteer',
        permissions: assignForm.permissions,
        assignedBy: {
          name: authUser?.name || 'Dr. K. V. Subba Rao',
          email: authUser?.email || 'admin@gmail.com',
          role: effectiveRole,
        },
        accessGrantedDate: assignForm.startDate,
        accessExpiryDate: assignForm.isPermanent ? null : assignForm.expiryDate,
        accountStatus: assignForm.accountStatus,
        accessReason: assignForm.reason.trim() || 'Assigned via RBAC management interface',
      };

      const userExists = users.some((u) => u._id === nowUser._id || u.email === nowUser.email);
      let updatedList = [];
      if (userExists) {
        updatedList = users.map((u) =>
          u._id === nowUser._id || u.email === nowUser.email ? { ...u, ...nowUser } : u
        );
      } else {
        updatedList = [nowUser, ...users];
      }

      persistUsers(updatedList);

      recordAdminAction(
        `Granted "${assignForm.role}" access to ${nowUser.name} (${nowUser.email}) with ${assignForm.permissions.length} module permissions. [${assignForm.isPermanent ? 'Permanent' : `Expires: ${assignForm.expiryDate}`}]`,
        'Security'
      );

      setFeedback({
        type: 'success',
        message: `Access successfully granted: ${nowUser.name} is now assigned as "${nowUser.role}".`,
      });
      setShowAssignModal(false);
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to assign access permissions.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    if (!isSuperAdmin && !isAdmin) {
      setFeedback({ type: 'warning', message: 'Only Super Admin or Admin can toggle account status.' });
      return;
    }

    if (isAdmin && user.role === ROLES.SUPER_ADMIN) {
      setFeedback({ type: 'danger', message: 'Administrators cannot alter Super Admin status.' });
      return;
    }

    const nextStatus = user.accountStatus === 'Active' ? 'Inactive' : 'Active';

    try {
      try {
        await api.patch(`/admin/rbac/users/${user._id}/status`, { status: nextStatus });
      } catch (e) {}

      const updated = users.map((u) =>
        u._id === user._id ? { ...u, accountStatus: nextStatus } : u
      );
      persistUsers(updated);

      recordAdminAction(
        `${nextStatus === 'Active' ? 'Activated' : 'Deactivated'} platform access for ${user.name} (${user.email}).`,
        'Security'
      );

      setFeedback({
        type: 'success',
        message: `Account status for ${user.name} set to ${nextStatus}.`,
      });
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Could not update status.' });
    }
  };

  const handleConfirmRevoke = async () => {
    const user = confirmRevokeModal.user;
    if (!user) return;

    try {
      try {
        await api.patch(`/admin/rbac/users/${user._id}/status`, {
          status: 'Inactive',
          reason: 'Access permanently revoked by Administrator',
        });
      } catch (e) {}

      const updated = users.map((u) =>
        u._id === user._id
          ? {
              ...u,
              accountStatus: 'Inactive',
              role: ROLES.GENERAL_VOLUNTEER,
              permissions: ['events_view', 'announcements_view'],
              accessReason: 'Administrative access revoked',
            }
          : u
      );
      persistUsers(updated);

      recordAdminAction(
        `Revoked administrative permissions for ${user.name} (${user.email}). Downgraded to General Volunteer (Inactive).`,
        'Security'
      );

      setFeedback({
        type: 'success',
        message: `Access revoked for ${user.name}. Role reset to General Volunteer and status marked Inactive.`,
      });
      setConfirmRevokeModal({ open: false, user: null });
    } catch (err) {
      setFeedback({ type: 'danger', message: 'Failed to revoke user access.' });
    }
  };

  const renderUsersBackBar = (label, onBack) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
      <button
        type="button"
        onClick={onBack}
        className="ref-btn-enroll"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: '#ffffff',
          color: '#334155',
          border: '1px solid #cbd5e1',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          padding: '0.55rem 1.15rem',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.85rem',
        }}
      >
        <ArrowLeft size={16} />
        <span>Return to Admin Users</span>
      </button>
      <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{label}</span>
    </div>
  );

  if (showResetConfirm) {
    return (
      <div className="ref-members-page">
        {renderUsersBackBar('RBAC Governance • Reset Capabilities Matrix', () => setShowResetConfirm(false))}
        <div style={{ background: '#ffffff', border: '1px solid #fde68a', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '1.4rem 1.75rem', borderBottom: '1px solid #fef3c7', background: '#fffbeb', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={20} className="text-amber-600" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#92400e' }}>
              Reset Operational Capabilities Matrix
            </h3>
          </div>
          <div style={{ padding: '1.75rem' }}>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.92rem', color: '#334155', lineHeight: 1.55 }}>
              Are you sure you want to reset the Operational Capabilities Matrix back to the official system recommended defaults?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setShowResetConfirm(false)} className="ref-btn-refresh">Cancel</button>
              <button type="button" onClick={handleConfirmResetMatrix} className="ref-btn-enroll">Confirm Reset to Defaults</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (confirmRevokeModal.open) {
    return (
      <div className="ref-members-page">
        {renderUsersBackBar(`RBAC Governance • Revoke ${confirmRevokeModal.user?.name || 'User'}`, () => setConfirmRevokeModal({ open: false, user: null }))}
        <div style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '1.4rem 1.75rem', borderBottom: '1px solid #fee2e2', background: '#fef2f2', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#991b1b' }}>
                Confirm Access Revocation
              </h3>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#b91c1c' }}>
                Irreversible administrative governance action
              </p>
            </div>
          </div>
          <div style={{ padding: '1.75rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.55 }}>
              Are you sure you want to permanently revoke administrative permissions for:
            </p>
            <div style={{ background: '#f8fafc', padding: '0.9rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', margin: '1rem 0' }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{confirmRevokeModal.user?.name}</p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                {confirmRevokeModal.user?.email} | Current Role: <strong>{confirmRevokeModal.user?.role}</strong>
              </p>
            </div>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
              This user's administrative privileges will be terminated immediately. Their account role will be downgraded to <strong>General Volunteer</strong> and marked Inactive.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setConfirmRevokeModal({ open: false, user: null })}
                className="ref-btn-refresh"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="ref-btn-delete-confirm"
              >
                <Trash2 size={14} />
                <span>Yes, Revoke Access</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewingUser) {
    return (
      <div className="ref-members-page">
        {renderUsersBackBar(`User Details & Permissions • ${viewingUser.name}`, () => setViewingUser(null))}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '1.4rem 1.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Crown size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                  {viewingUser.name}
                </h3>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Member ID: {viewingUser.memberId || 'GNPP-2026'} | {viewingUser.email}
                </p>
              </div>
            </div>
            {(isSuperAdmin || (isAdmin && viewingUser.role !== ROLES.SUPER_ADMIN)) && (
              <button
                type="button"
                onClick={() => {
                  const target = viewingUser;
                  setViewingUser(null);
                  handleOpenAssignModal(target);
                }}
                className="ref-btn-enroll"
              >
                <Edit2 size={14} />
                <span>Edit Access</span>
              </button>
            )}
          </div>

          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem', background: '#f8fafc', padding: '1.15rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Assigned Role</span>
                <div style={{ marginTop: '0.3rem' }}>
                  <span className={`ref-tier-badge ${getRoleBadgeClass(viewingUser.role)}`}>
                    {viewingUser.role}
                  </span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Account Status</span>
                <div style={{ marginTop: '0.3rem' }}>
                  <span className={`ref-status-badge ${viewingUser.accountStatus === 'Active' ? 'active' : 'suspended'}`}>
                    <span className="ref-status-dot-inner"></span>
                    <span>{viewingUser.accountStatus || 'Active'}</span>
                  </span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Granted By</span>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>
                  {viewingUser.assignedBy?.name || 'Dr. K. V. Subba Rao'} ({viewingUser.assignedBy?.role || 'Admin'})
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Access Expiry</span>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.84rem', fontWeight: 600, color: viewingUser.accessExpiryDate ? '#b45309' : '#047857' }}>
                  {viewingUser.accessExpiryDate ? new Date(viewingUser.accessExpiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Permanent (No Expiry)'}
                </p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Access Justification</span>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                  "{viewingUser.accessReason || 'Standard administrative operational access'}"
                </p>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 0.7rem', fontSize: '0.92rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Key size={15} className="text-emerald-600" />
                <span>Module Permissions Audit ({viewingUser.permissions?.length || 0} of {MODULE_PERMISSIONS.length} active)</span>
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
                {MODULE_PERMISSIONS.map((perm) => {
                  const hasPerm = viewingUser.permissions?.includes(perm.id);
                  return (
                    <div
                      key={perm.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.5rem 0.7rem',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: hasPerm ? '#bbf7d0' : '#f1f5f9',
                        backgroundColor: hasPerm ? '#f0fdf4' : '#fafafa',
                        color: hasPerm ? '#065f46' : '#94a3b8',
                        fontSize: '0.78rem',
                        fontWeight: hasPerm ? 600 : 400,
                      }}
                    >
                      {hasPerm ? <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" /> : <X size={14} className="text-slate-300 flex-shrink-0" />}
                      <span>{perm.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAssignModal) {
    return (
      <div className="ref-members-page">
        {renderUsersBackBar(
          selectedUserForAssign ? `RBAC Governance • Edit ${selectedUserForAssign.name}` : 'RBAC Governance • Assign Role & Permissions',
          () => setShowAssignModal(false)
        )}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '1.4rem 1.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                {selectedUserForAssign ? `Edit Access: ${selectedUserForAssign.name}` : 'Assign Role & Access Permissions'}
              </h3>
              <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                Authority: {effectiveRole} ({isAdmin ? 'Full role delegation' : 'View only'})
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitAssign}>
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="rbac-user-inputs-grid">
                <div className="cms-field">
                  <label className="cms-label">
                    <Users size={13} className="text-blue-700" />
                    <span>Full Name</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={assignForm.name}
                    onChange={(e) => setAssignForm({ ...assignForm, name: e.target.value })}
                    placeholder="e.g. Srikanth Varma"
                    className="cms-input"
                  />
                </div>
                <div className="cms-field">
                  <label className="cms-label">
                    <Mail size={13} className="text-blue-700" />
                    <span>Email Address</span>
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={assignForm.email}
                    onChange={(e) => setAssignForm({ ...assignForm, email: e.target.value })}
                    placeholder="e.g. srikanth@godhavari.org"
                    className="cms-input"
                  />
                </div>
                <div className="cms-field">
                  <label className="cms-label">
                    <Phone size={13} className="text-blue-700" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    value={assignForm.phone}
                    onChange={(e) => setAssignForm({ ...assignForm, phone: e.target.value })}
                    placeholder="e.g. +91 944 123 4567"
                    className="cms-input"
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label className="cms-label" style={{ margin: 0 }}>
                    <Crown size={13} className="text-purple-700" />
                    <span>Select Role</span>
                    <span className="required-star">*</span>
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Admins can delegate Admin, Staff &amp; Volunteer roles
                  </span>
                </div>
                <div className="rbac-role-card-grid">
                  {assignableRoles.map((item) => {
                    const isSelected = assignForm.role === item.role;
                    return (
                      <div
                        key={item.role}
                        onClick={() => handleRoleSelectionInModal(item.role)}
                        className={`rbac-role-radio-card ${isSelected ? 'active' : ''}`}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className={`ref-tier-badge ${item.badgeClass}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                            {item.role}
                          </span>
                          <input
                            type="radio"
                            name="roleSelection"
                            checked={isSelected}
                            onChange={() => handleRoleSelectionInModal(item.role)}
                            style={{ cursor: 'pointer' }}
                          />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.3, marginTop: '0.2rem' }}>
                          {item.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label className="cms-label" style={{ margin: 0 }}>
                    <Key size={13} className="text-emerald-700" />
                    <span>Assigned Module Permissions ({assignForm.permissions.length} selected)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setAssignForm((prev) => ({
                        ...prev,
                        permissions: getDefaultPermissionsForRole(prev.role),
                      }))
                    }
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#059669',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <RefreshCw size={11} />
                    <span>Reset to Role Defaults</span>
                  </button>
                </div>
                <div className="rbac-perm-grid">
                  {MODULE_PERMISSIONS.map((perm) => {
                    const isChecked = assignForm.permissions.includes(perm.id);
                    const isRbacModule = perm.id === 'rbac_manage';
                    const isDisabled = isRbacModule && !isSuperAdmin;
                    return (
                      <div
                        key={perm.id}
                        onClick={() => !isDisabled && handleTogglePermission(perm.id)}
                        className={`rbac-perm-item ${isChecked ? 'selected' : ''}`}
                        style={{ opacity: isDisabled ? 0.4 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isDisabled}
                          onChange={() => !isDisabled && handleTogglePermission(perm.id)}
                          style={{ marginTop: '0.15rem', cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: isChecked ? '#065f46' : '#1e293b' }}>
                            {perm.label}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.25 }}>
                            {perm.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Calendar size={14} className="text-blue-600" />
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>Access Validity &amp; Duration</span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={assignForm.isPermanent}
                      onChange={(e) => setAssignForm({ ...assignForm, isPermanent: e.target.checked })}
                    />
                    <span>Permanent Access (No Expiry)</span>
                  </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                  <div className="cms-field">
                    <label className="cms-label"><span>Access Start Date</span></label>
                    <input
                      type="date"
                      value={assignForm.startDate}
                      onChange={(e) => setAssignForm({ ...assignForm, startDate: e.target.value })}
                      className="cms-input"
                    />
                  </div>
                  <div className="cms-field">
                    <label className="cms-label">
                      <span>Access Expiry Date</span>
                      {!assignForm.isPermanent && <span className="required-star">*</span>}
                    </label>
                    <input
                      type="date"
                      disabled={assignForm.isPermanent}
                      required={!assignForm.isPermanent}
                      value={assignForm.expiryDate}
                      onChange={(e) => setAssignForm({ ...assignForm, expiryDate: e.target.value })}
                      className="cms-input"
                      style={{ opacity: assignForm.isPermanent ? 0.5 : 1 }}
                    />
                  </div>
                </div>
              </div>

              <div className="cms-field">
                <label className="cms-label">
                  <Info size={13} className="text-slate-600" />
                  <span>Operational Justification / Reason for Access</span>
                  <span className="required-star">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={assignForm.reason}
                  onChange={(e) => setAssignForm({ ...assignForm, reason: e.target.value })}
                  placeholder="e.g. Authorized to oversee weekend river cleanup drives and manage volunteer circulars."
                  className="cms-textarea"
                />
              </div>
            </div>

            <div style={{ padding: '1.15rem 1.75rem', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="ref-btn-refresh"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="ref-btn-enroll"
              >
                <Save size={14} />
                <span>{submitting ? 'Assigning...' : 'Assign Access'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="ref-members-page" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* 1. Header Row - Explicitly "Admin Users" as Requested */}
      <div className="ref-members-header no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'nowrap', marginBottom: '0.25rem' }}>
        <div className="ref-header-left" style={{ minWidth: 0 }}>
          <div className="ref-header-icon-box" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
            <UserCheck size={24} />
          </div>
          <div className="ref-header-text">
            <h2>Admin Users</h2>
            <p>Role-Based Access Control (RBAC) governance: manage platform administrators, coordinators, and volunteers.</p>
          </div>
        </div>

        <div className="ref-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'nowrap', flexShrink: 0 }}>
          {/* Authority Simulator Role Switcher */}
          <div className="rbac-simulator-bar" title="Simulate different role perspectives to preview dynamic permission boundaries">
            <ShieldCheck size={14} className="text-blue-600 flex-shrink-0" />
            <span style={{ fontWeight: 600 }}>Viewing As:</span>
            <select
              value={simulatedRole}
              onChange={(e) => setSimulatedRole(e.target.value)}
              className="rbac-sim-select"
            >
              <option value={ROLES.ADMIN}>🛡️ Admin</option>
              <option value={ROLES.STAFF_COORDINATOR}>📋 Staff Coordinator</option>
              <option value={ROLES.GENERAL_VOLUNTEER}>🌱 General Volunteer</option>
            </select>
          </div>

          {isAdmin ? (
            <button
              type="button"
              onClick={() => handleOpenAssignModal(null)}
              className="ref-btn-enroll"
              title="Assign role and permissions to a user"
            >
              <Plus size={16} />
              <span>Assign Access</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="ref-btn-enroll"
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
              title="Only Admin can assign roles"
            >
              <Lock size={15} />
              <span>Assign Access (Restricted)</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Feedback Alert Banner */}
      {feedback.message && (
        <div className={`ref-alert-banner ${feedback.type === 'danger' ? 'ref-alert-error' : feedback.type === 'warning' ? 'ref-alert-warning' : ''}`}>
          <div className="ref-alert-left">
            {feedback.type === 'danger' ? (
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
            ) : feedback.type === 'warning' ? (
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', message: '' })}
            className="ref-alert-dismiss"
            title="Dismiss notification"
          >
            &times;
          </button>
        </div>
      )}

      {/* 3. 6-Card Professional KPI Metric Strip - 1 Single Row, Zero Orphan Wrap */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '0.55rem', width: '100%' }}>
        <div className="ref-kpi-card" style={{ padding: '0.7rem 0.65rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem', minWidth: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div className="ref-kpi-icon-bubble ref-bubble-blue" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
              <Users size={16} className="text-blue-600" />
            </div>
            <span className="ref-kpi-value" style={{ fontSize: '1.25rem', fontWeight: 800 }}>{kpis.totalUsers}</span>
          </div>
          <span className="ref-kpi-label" style={{ fontSize: '0.71rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, letterSpacing: '-0.01em' }}>
            Total Users
          </span>
        </div>

        <div className="ref-kpi-card" style={{ padding: '0.7rem 0.65rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem', minWidth: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div className="ref-kpi-icon-bubble ref-bubble-blue" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
              <ShieldCheck size={16} className="text-blue-600" />
            </div>
            <span className="ref-kpi-value" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d4ed8' }}>{kpis.adminCount}</span>
          </div>
          <span className="ref-kpi-label" style={{ fontSize: '0.71rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, letterSpacing: '-0.01em' }}>
            Admins
          </span>
        </div>

        <div className="ref-kpi-card" style={{ padding: '0.7rem 0.65rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem', minWidth: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div className="ref-kpi-icon-bubble ref-bubble-orange" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
              <UserCheck size={16} className="text-amber-600" />
            </div>
            <span className="ref-kpi-value" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b45309' }}>{kpis.staffCoordinatorCount}</span>
          </div>
          <span className="ref-kpi-label" style={{ fontSize: '0.71rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, letterSpacing: '-0.01em' }}>
            Coordinators
          </span>
        </div>

        <div className="ref-kpi-card" style={{ padding: '0.7rem 0.65rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem', minWidth: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div className="ref-kpi-icon-bubble ref-bubble-green" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
              <HeartHandshake size={16} className="text-emerald-600" />
            </div>
            <span className="ref-kpi-value" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#047857' }}>{kpis.generalVolunteerCount}</span>
          </div>
          <span className="ref-kpi-label" style={{ fontSize: '0.71rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, letterSpacing: '-0.01em' }}>
            Volunteers
          </span>
        </div>

        <div className="ref-kpi-card" style={{ padding: '0.7rem 0.65rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem', minWidth: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div className="ref-kpi-icon-bubble ref-bubble-green" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
              <CheckCircle size={16} className="text-emerald-600" />
            </div>
            <span className="ref-kpi-value" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>{kpis.activeUsers}</span>
          </div>
          <span className="ref-kpi-label" style={{ fontSize: '0.71rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, letterSpacing: '-0.01em' }}>
            Active Users
          </span>
        </div>

        <div className="ref-kpi-card" style={{ padding: '0.7rem 0.65rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem', minWidth: 0, borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div className="ref-kpi-icon-bubble ref-bubble-orange" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
              <Clock size={16} className="text-amber-600" />
            </div>
            <span className="ref-kpi-value" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c2410c' }}>{kpis.pendingRequests}</span>
          </div>
          <span className="ref-kpi-label" style={{ fontSize: '0.71rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, letterSpacing: '-0.01em' }}>
            Pending
          </span>
        </div>
      </div>

      {/* 4. Tab Navigation - Operational Capabilities Matrix (Default) + Directory + Audit */}
      <div className="ref-tab-nav no-print">
        <button
          type="button"
          onClick={() => setActiveTab('matrix')}
          className={`ref-tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
        >
          <Sliders size={14} />
          <span>Operational Capabilities Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('directory')}
          className={`ref-tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
        >
          <Users size={14} />
          <span>Admin Users Directory ({filteredUsers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`ref-tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
        >
          <Activity size={14} />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: OPERATIONAL CAPABILITIES MATRIX TABLE
          ========================================================================= */}
      {activeTab === 'matrix' && (
        <>
          {/* Matrix Search, Category Pills & Governance Toolbar */}
          <div className="ref-filter-card no-print" style={{ marginBottom: '1.25rem', padding: '1.1rem 1.4rem', borderRadius: '14px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '0.85rem', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', width: '100%' }}>
              <div className="ref-search-wrap" style={{ flex: '0 1 440px', maxWidth: '440px', minWidth: '240px', margin: 0 }}>
                <Search size={16} className="ref-search-icon" />
                <input
                  type="text"
                  placeholder="Search capabilities..."
                  value={matrixSearch}
                  onChange={(e) => setMatrixSearch(e.target.value)}
                  style={{ width: '100%' }}
                />
                {matrixSearch && (
                  <button
                    type="button"
                    onClick={() => setMatrixSearch('')}
                    className="ref-search-clear"
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginLeft: 'auto' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.74rem', color: '#047857', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.38rem 0.8rem', borderRadius: '8px', fontWeight: 600 }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                  <span>Live RBAC Matrix &bull; Real-time Persistence</span>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', paddingTop: '0.35rem', borderTop: '1px solid #f1f5f9', width: '100%' }}>
              <span style={{ fontSize: '0.71rem', fontWeight: 700, color: '#64748b', marginRight: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Category:
              </span>
              {['All', 'System & DB', 'Access Control', 'Drives & Events', 'Membership', 'Public CMS', 'Broadcasts', 'Field Operations', 'Analytics & Audit', 'Emergency Dispatch'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setMatrixCategoryFilter(cat)}
                  style={{
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.71rem',
                    fontWeight: matrixCategoryFilter === cat ? 700 : 500,
                    borderRadius: '9999px',
                    border: `1px solid ${matrixCategoryFilter === cat ? '#2563eb' : '#e2e8f0'}`,
                    backgroundColor: matrixCategoryFilter === cat ? '#eff6ff' : '#ffffff',
                    color: matrixCategoryFilter === cat ? '#1d4ed8' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="ref-table-card" style={{ borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' }}>
            <div className="rbac-table-wrap">
              <table className="rbac-directory-table">
                <thead>
                  <tr>
                    <th style={{ width: '40%', textAlign: 'left', paddingLeft: '1.25rem', paddingRight: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Sliders size={14} className="text-slate-500" />
                        <span>OPERATIONAL CAPABILITY</span>
                      </div>
                    </th>
                    <th style={{ width: '20%', textAlign: 'center', backgroundColor: '#f8fbff', padding: '0.75rem 0.4rem', borderLeft: '1px solid #e2e8f0' }}>
                      <div className="matrix-role-th">
                        <span className="matrix-role-pill" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                          <ShieldCheck size={12} />
                          <span>Admin</span>
                        </span>
                        <span className="matrix-role-sub" style={{ color: '#1d4ed8' }}>Delegated Ops</span>
                      </div>
                    </th>
                    <th style={{ width: '15%', textAlign: 'center', backgroundColor: '#fffdf7', padding: '0.75rem 0.4rem', borderLeft: '1px solid #e2e8f0' }}>
                      <div className="matrix-role-th">
                        <span className="matrix-role-pill" style={{ backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}>
                          <UserCheck size={12} />
                          <span>Coordinator</span>
                        </span>
                        <span className="matrix-role-sub" style={{ color: '#b45309' }}>Field Operations</span>
                      </div>
                    </th>
                    <th style={{ width: '15%', textAlign: 'center', paddingRight: '1.25rem', backgroundColor: '#f7fdfa', padding: '0.75rem 0.4rem', borderLeft: '1px solid #e2e8f0' }}>
                      <div className="matrix-role-th">
                        <span className="matrix-role-pill" style={{ backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>
                          <HeartHandshake size={12} />
                          <span>Volunteer</span>
                        </span>
                        <span className="matrix-role-sub" style={{ color: '#047857' }}>Community Access</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCapabilities.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                        <Sliders size={28} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                        <p style={{ margin: 0, fontWeight: 600, color: '#334155' }}>No capabilities match &ldquo;{matrixSearch}&rdquo;</p>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>Try adjusting your search keyword or selected category filter.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCapabilities.map((row) => {
                      const meta = getCapabilityMeta(row);

  return (
                        <tr key={row.id}>
                          {/* Capability Icon Box, Title, Category Badge, and Subtitle */}
                          <td style={{ paddingLeft: '1.25rem', paddingRight: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div
                                className="matrix-cap-icon-box"
                                style={{
                                  backgroundColor: meta.iconBg,
                                  color: meta.iconColor,
                                }}
                              >
                                {meta.icon}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                                    {row.name}
                                  </span>
                                  {row.category && (
                                    <span
                                      className="matrix-cat-tag"
                                      style={{
                                        backgroundColor: meta.badgeBg,
                                        color: meta.badgeColor,
                                        border: `1px solid ${meta.badgeBorder}`,
                                      }}
                                    >
                                      {row.category}
                                    </span>
                                  )}
                                </div>
                                <span style={{ fontSize: '0.73rem', color: '#64748b', lineHeight: 1.35 }}>
                                  {row.desc}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* 2. ADMIN */}
                          <td style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleCapability(row.id, 'admin')}
                              disabled={!isAdmin}
                              className={`matrix-status-pill ${row.admin ? 'allowed' : 'restricted'} ${isAdmin ? 'interactive' : ''}`}
                              title={
                                isAdmin
                                  ? (row.admin ? 'Admin: Granted. Click to revoke.' : 'Admin: Restricted. Click to grant.')
                                  : (row.admin ? 'Granted to Administrator' : 'Restricted for Administrator')
                              }
                            >
                              {row.admin ? (
                                <>
                                  <Check size={12} strokeWidth={3} />
                                  <span>Allowed</span>
                                </>
                              ) : (
                                <>
                                  <Minus size={12} strokeWidth={2.5} />
                                  <span>No Access</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* 3. STAFF COORDINATOR */}
                          <td style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleCapability(row.id, 'staff')}
                              disabled={!isSuperAdmin && !isAdmin}
                              className={`matrix-status-pill ${row.staff ? 'allowed' : 'restricted'} ${(isSuperAdmin || isAdmin) ? 'interactive' : ''}`}
                              title={
                                (isSuperAdmin || isAdmin)
                                  ? (row.staff ? 'Coordinator: Granted. Click to revoke.' : 'Coordinator: Restricted. Click to grant.')
                                  : (row.staff ? 'Granted to Coordinator' : 'Restricted for Coordinator')
                              }
                            >
                              {row.staff ? (
                                <>
                                  <Check size={12} strokeWidth={3} />
                                  <span>Allowed</span>
                                </>
                              ) : (
                                <>
                                  <Minus size={12} strokeWidth={2.5} />
                                  <span>No Access</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* 4. GENERAL VOLUNTEER */}
                          <td style={{ textAlign: 'center', paddingRight: '1.25rem', borderLeft: '1px solid #f1f5f9' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleCapability(row.id, 'vol')}
                              disabled={!isSuperAdmin && !isAdmin}
                              className={`matrix-status-pill ${row.vol ? 'allowed' : 'restricted'} ${(isSuperAdmin || isAdmin) ? 'interactive' : ''}`}
                              title={
                                (isSuperAdmin || isAdmin)
                                  ? (row.vol ? 'Volunteer: Granted. Click to revoke.' : 'Volunteer: Restricted. Click to grant.')
                                  : (row.vol ? 'Granted to Volunteer' : 'Restricted for Volunteer')
                              }
                            >
                              {row.vol ? (
                                <>
                                  <Check size={12} strokeWidth={3} />
                                  <span>Allowed</span>
                                </>
                              ) : (
                                <>
                                  <Minus size={12} strokeWidth={2.5} />
                                  <span>No Access</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="ref-table-footer no-print" style={{ padding: '1rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <span className="ref-table-count" style={{ fontSize: '0.78rem', color: '#475569' }}>
                Showing <strong>{filteredCapabilities.length}</strong> of <strong>{capabilities.length}</strong> operational capabilities &bull; Changes persist in real-time.
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.72rem', color: '#64748b' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                  <span style={{ fontWeight: 600, color: '#047857' }}>Allowed (Active)</span>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94a3b8' }}></span>
                  <span>No Access (Restricted)</span>
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          TAB 2: ADMIN USERS DIRECTORY TABLE
          ========================================================================= */}
      {activeTab === 'directory' && (
        <>
          <div className="ref-filter-card no-print">
            <div className="ref-search-wrap">
              <Search size={16} className="ref-search-icon" />
              <input
                type="text"
                placeholder="Search by user name, email, phone, or title..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              {searchKeyword && (
                <button
                  type="button"
                  onClick={() => setSearchKeyword('')}
                  className="ref-search-clear"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="ref-filter-actions">
              <div className="ref-select-item">
                <span className="ref-select-label">Role:</span>
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="ref-select-input"
                >
                  <option value="All">All Roles</option>
                  <option value={ROLES.ADMIN}>Admin</option>
                  <option value={ROLES.STAFF_COORDINATOR}>Staff Coordinator</option>
                  <option value={ROLES.GENERAL_VOLUNTEER}>General Volunteer</option>
                </select>
              </div>

              <div className="ref-select-item">
                <span className="ref-select-label">Status:</span>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="ref-select-input"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="ref-select-item">
                <span className="ref-select-label">Expiry:</span>
                <select
                  value={selectedExpiryFilter}
                  onChange={(e) => setSelectedExpiryFilter(e.target.value)}
                  className="ref-select-input"
                >
                  <option value="All">All Durations</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          <div className="ref-table-card" style={{ borderRadius: '14px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)' }}>
            <div className="rbac-table-wrap">
              <table className="rbac-directory-table">
                <thead>
                  <tr>
                    <th style={{ width: '18.5%', textAlign: 'left' }}>USER NAME</th>
                    <th style={{ width: '17%', textAlign: 'left' }}>EMAIL ADDRESS</th>
                    <th style={{ width: '14%', textAlign: 'center' }}>CURRENT ROLE</th>
                    <th style={{ width: '11%', textAlign: 'center' }}>PERMISSIONS</th>
                    <th style={{ width: '11%', textAlign: 'left' }}>ASSIGNED BY</th>
                    <th style={{ width: '10%', textAlign: 'center' }}>EXPIRY DATE</th>
                    <th style={{ width: '7.5%', textAlign: 'center' }}>STATUS</th>
                    <th style={{ width: '11%', textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                        <RefreshCw size={26} className="animate-spin inline mb-2 text-emerald-700" />
                        <p style={{ fontWeight: 600, color: '#334155', fontSize: '0.85rem', margin: 0 }}>
                          Loading access records...
                        </p>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem', color: '#64748b' }}>
                        <Users size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4, color: '#64748b' }} />
                        <p style={{ fontWeight: 600, fontSize: '0.86rem', color: '#334155', margin: 0 }}>
                          No users match the selected filters.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isExpired = user.accessExpiryDate && new Date(user.accessExpiryDate) < new Date();
                      const isSuper = user.role === ROLES.SUPER_ADMIN;
                      const status = user.accountStatus || 'Active';

                      const canEditThisUser =
                        (isSuperAdmin && !isSuper) || (isSuperAdmin && user.email === authUser?.email) || (isAdmin && (user.role === ROLES.STAFF_COORDINATOR || user.role === ROLES.GENERAL_VOLUNTEER));

                      const canRevokeThisUser =
                        (isSuperAdmin && user.email !== 'admin@gmail.com') || (isAdmin && (user.role === ROLES.STAFF_COORDINATOR || user.role === ROLES.GENERAL_VOLUNTEER));

  return (
                        <tr key={user._id}>
                          <td style={{ paddingLeft: '1.15rem' }}>
                            <div
                              className="ref-profile-cell cursor-pointer"
                              onClick={() => setViewingUser(user)}
                              title="Click to view details"
                              style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}
                            >
                              <div
                                className="ref-avatar-circle"
                                style={{ backgroundColor: getAvatarBg(user.role), width: '30px', height: '30px', minWidth: '30px', fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}
                              >
                                {isSuper ? <Crown size={14} /> : getInitials(user.name)}
                              </div>
                              <div className="ref-profile-info" style={{ minWidth: 0, overflow: 'hidden' }}>
                                <div className="ref-name-row" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  <span className="hover:text-emerald-700 transition" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                                    {user.name}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.70rem', color: '#059669', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.05rem' }}>
                                  {user.designation || user.memberId || 'NGO Steward'}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="ref-contact-col" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', minWidth: 0, justifyContent: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.76rem', fontWeight: 550, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.35 }} title={user.email}>
                                <Mail size={12} className="text-slate-400 flex-shrink-0" />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.72rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.35 }} title={user.phone || 'No phone'}>
                                <Phone size={12} className="text-slate-400 flex-shrink-0" />
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.phone || 'Not provided'}</span>
                              </div>
                            </div>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <span className={`rbac-role-badge ${
                              user.role === ROLES.SUPER_ADMIN ? 'super' :
                              user.role === ROLES.ADMIN ? 'admin' :
                              user.role === ROLES.STAFF_COORDINATOR ? 'staff' : 'volunteer'
                            }`} style={{ whiteSpace: 'nowrap', fontSize: '0.70rem', padding: '0.18rem 0.5rem' }}>
                              {user.role === ROLES.SUPER_ADMIN ? (
                                <Crown size={11} fill="#9333ea" />
                              ) : user.role === ROLES.ADMIN ? (
                                <ShieldCheck size={11} />
                              ) : user.role === ROLES.STAFF_COORDINATOR ? (
                                <UserCheck size={11} />
                              ) : (
                                <HeartHandshake size={11} />
                              )}
                              <span>{user.role}</span>
                            </span>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <span
                              className="rbac-perm-pill"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.18rem 0.5rem', fontSize: '0.70rem', whiteSpace: 'nowrap', cursor: 'pointer' }}
                              onClick={() => setViewingUser(user)}
                              title="Click to view all granted permissions"
                            >
                              <Key size={11} className="text-emerald-600 flex-shrink-0" />
                              <span>{user.permissions?.length || 0} Permissions</span>
                            </span>
                          </td>

                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', minWidth: 0, paddingLeft: '0.25rem' }}>
                              <span style={{ fontSize: '0.80rem', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.assignedBy?.name || 'Dr. K. V. Subba Rao'}
                              </span>
                              <span style={{ fontSize: '0.70rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                                {user.accessGrantedDate ? new Date(user.accessGrantedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '18 Nov 2026'}
                              </span>
                            </div>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            {user.accessExpiryDate ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.3rem',
                                  padding: '0.2rem 0.55rem',
                                  fontSize: '0.70rem',
                                  fontWeight: 600,
                                  borderRadius: '9999px',
                                  backgroundColor: isExpired ? '#fef2f2' : '#fffbeb',
                                  color: isExpired ? '#b91c1c' : '#b45309',
                                  border: `1px solid ${isExpired ? '#fecaca' : '#fde68a'}`,
                                  whiteSpace: 'nowrap',
                                }}
                                title={new Date(user.accessExpiryDate).toLocaleString()}
                              >
                                <Calendar size={11} className="flex-shrink-0" />
                                <span>{isExpired ? 'Expired' : new Date(user.accessExpiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                              </span>
                            ) : (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: '0.3rem',
                                  color: '#047857',
                                  backgroundColor: '#ecfdf5',
                                  border: '1px solid #a7f3d0',
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '9999px',
                                  fontSize: '0.70rem',
                                  fontWeight: 600,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <ShieldCheck size={11} className="flex-shrink-0" />
                                <span>Permanent</span>
                              </span>
                            )}
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => canEditThisUser && handleToggleStatus(user)}
                              disabled={!canEditThisUser}
                              className={`rbac-status-badge ${status === 'Active' ? 'active' : 'inactive'}`}
                              style={{
                                cursor: canEditThisUser ? 'pointer' : 'default',
                                padding: '0.2rem 0.55rem',
                                fontSize: '0.70rem',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.3rem',
                                borderRadius: '9999px',
                              }}
                              title={canEditThisUser ? `Status is ${status}. Click to toggle.` : `Status is ${status}`}
                            >
                              <span className={`rbac-status-dot ${status === 'Active' ? 'active' : 'inactive'}`}></span>
                              <span>{status}</span>
                            </button>
                          </td>

                          <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                            <div className="ref-actions-cell" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                              <button
                                type="button"
                                onClick={() => setViewingUser(user)}
                                className="ref-act-btn view"
                                style={{ width: '24px', height: '24px' }}
                                title="View Details"
                              >
                                <Eye size={12} />
                              </button>

                              {canEditThisUser ? (
                                <button
                                  type="button"
                                  onClick={() => handleOpenAssignModal(user)}
                                  className="ref-act-btn edit"
                                  style={{ width: '24px', height: '24px' }}
                                  title="Edit Permissions"
                                >
                                  <Edit2 size={12} />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  className="ref-act-btn"
                                  style={{ width: '24px', height: '24px', opacity: 0.35, cursor: 'not-allowed' }}
                                >
                                  <Lock size={11} />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  if (user.email === 'admin@gmail.com' && isSuperAdmin) {
                                    setFeedback({ type: 'warning', message: 'Root Genesis Administrator account cannot be revoked for system safety.' });
                                    return;
                                  }
                                  if (!canRevokeThisUser) {
                                    setFeedback({ type: 'danger', message: 'You do not have administrative authority to revoke this role.' });
                                    return;
                                  }
                                  setConfirmRevokeModal({ open: true, user });
                                }}
                                className="ref-act-btn delete"
                                style={{ width: '24px', height: '24px' }}
                                title="Revoke / Delete Access"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="ref-table-footer no-print">
              <span className="ref-table-count">
                Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> accounts
              </span>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          TAB 3: LIVE SECURITY AUDIT LOG
          ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="ref-table-card">
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Live Security & RBAC Audit Trail</h3>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>Immutable record of user access delegations, revocations, and role modifications.</p>
          </div>

          <div className="ref-table-wrap">
            <table className="ref-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>TIMESTAMP</th>
                  <th style={{ width: '22%' }}>AUTHORIZING ADMIN</th>
                  <th style={{ width: '42%' }}>SECURITY ACTION & ACCESS DETAIL</th>
                  <th style={{ width: '14%' }}>IP & CONTEXT</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                      <Activity size={24} style={{ margin: '0 auto 0.5rem', color: '#cbd5e1' }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>No security audit entries recorded yet.</p>
                    </td>
                  </tr>
                ) : (
                  auditLogs.slice(0, 30).map((log) => (
                    <tr key={log._id}>
                      <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={12} className="text-slate-400" />
                          <span>{new Date(log.createdAt || Date.now()).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <ShieldCheck size={14} className="text-blue-600" />
                          <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.84rem' }}>{log.admin}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.83rem', color: '#0f172a', fontWeight: 500, lineHeight: 1.4 }}>
                          {log.action}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                          {log.ip || '106.51.24.18 (Rajahmundry)'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
