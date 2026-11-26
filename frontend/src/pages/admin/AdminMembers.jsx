import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { recordAdminAction } from '../../services/auditService';
import {
  Users,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  RefreshCw,
  X,
  Mail,
  Phone,
  Star,
  User,
  Pause,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  Shield,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  AlertTriangle,
  Award,
  CreditCard,
  Check,
  ArrowLeft,
} from 'lucide-react';

const AdminMembers = () => {
  const { user: currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tierFilter, setTierFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'directory' | 'membership'

  // Modal States for Full CRUD Operations
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedMember, setSelectedMember] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Auto-dismiss feedback after 4.5 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ type: '', message: '' });
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Form State for Adding New Member (Create)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'member',
    designation: 'General Member',
    membershipType: 'Annual Member',
    status: 'Active',
    feePaid: 500,
    paymentStatus: 'Paid',
    validTo: '',
    bloodGroup: 'O+',
    street: '',
    city: 'Rajahmundry',
  });

  // Form State for Editing Existing Member (Update)
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'member',
    designation: 'General Member',
    membershipType: 'Annual Member',
    status: 'Active',
    feePaid: 500,
    paymentStatus: 'Paid',
    validTo: '',
    bloodGroup: 'O+',
    street: '',
    city: 'Rajahmundry',
  });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/members');
      setMembers(data.members || []);
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to load member records from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Update default fee when tier changes in enroll form
  const handleTierChangeInAdd = (tier) => {
    let fee = 500;
    if (tier === 'Life Member') fee = 5000;
    else if (tier === 'Volunteer Member') fee = 0;
    else if (tier === 'Patron') fee = 10000;
    else if (tier === 'Student Member') fee = 250;

    setFormData((prev) => ({
      ...prev,
      membershipType: tier,
      feePaid: fee,
    }));
  };

  // 1. CREATE: Handle Enrolling a New Member
  const handleAddMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      await API.post('/admin/members', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        designation: formData.designation,
        membershipType: formData.membershipType,
        status: formData.status,
        feePaid: Number(formData.feePaid) || 0,
        paymentStatus: formData.paymentStatus,
        validTo: formData.validTo || undefined,
        bloodGroup: formData.bloodGroup,
        address: { street: formData.street, city: formData.city },
      });

      setFeedback({ type: 'success', message: `Member "${formData.name}" successfully enrolled!` });
      setShowAddModal(false);
      recordAdminAction({
        action: `Enrolled new member "${formData.name}" (${formData.membershipType})`,
        category: 'Membership',
        adminName: currentUser?.name || 'Dr. K. V. Subba Rao',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'member',
        designation: 'General Member',
        membershipType: 'Annual Member',
        status: 'Active',
        feePaid: 500,
        paymentStatus: 'Paid',
        validTo: '',
        bloodGroup: 'O+',
        street: '',
        city: 'Rajahmundry',
      });
      fetchMembers();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to create member record',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 2. READ: Open Full Details Modal
  const openViewModal = (member) => {
    setSelectedMember(member);
    setShowViewModal(true);
  };

  // 3. UPDATE: Open Edit Modal with Pre-populated Data
  const openEditModal = (member) => {
    setSelectedMember(member);
    const validToDate = member.membership?.validTo
      ? new Date(member.membership.validTo).toISOString().split('T')[0]
      : '';

    setEditFormData({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      role: member.role || 'member',
      designation: member.designation || 'General Member',
      membershipType: member.membership?.membershipType || member.membershipType || 'Annual Member',
      status: member.membership?.status || 'Active',
      feePaid: member.membership?.feePaid ?? (member.membershipType === 'Life Member' ? 5000 : 500),
      paymentStatus: member.membership?.paymentStatus || 'Paid',
      validTo: validToDate,
      bloodGroup: member.bloodGroup || 'O+',
      street: member.address?.street || '',
      city: member.address?.city || 'Rajahmundry',
    });
    setShowEditModal(true);
  };

  // Submit Edit Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      await API.patch(`/admin/members/${selectedMember._id}`, {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        role: editFormData.role,
        designation: editFormData.designation,
        membershipType: editFormData.membershipType,
        status: editFormData.status,
        feePaid: Number(editFormData.feePaid) || 0,
        paymentStatus: editFormData.paymentStatus,
        validTo: editFormData.validTo || undefined,
        bloodGroup: editFormData.bloodGroup,
        address: { street: editFormData.street, city: editFormData.city },
      });

      setFeedback({
        type: 'success',
        message: `Member and membership records for "${editFormData.name}" successfully updated!`,
      });
      setShowEditModal(false);
      setSelectedMember(null);
      recordAdminAction({
        action: `Updated profile & membership record for "${editFormData.name}"`,
        category: 'Membership',
        adminName: currentUser?.name || 'Dr. K. V. Subba Rao',
      });
      fetchMembers();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update member record',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 4. UPDATE (Quick): Suspend / Activate Toggle
  const handleStatusToggle = async (userId, currentStatus, memberName) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await API.patch(`/admin/members/${userId}/membership`, { status: nextStatus });
      setFeedback({
        type: 'success',
        message: `Membership status for "${memberName}" updated to ${nextStatus}`,
      });
      recordAdminAction({
        action: `Updated membership status for "${memberName}" to ${nextStatus}`,
        category: 'Membership',
        adminName: currentUser?.name || 'Dr. K. V. Subba Rao',
      });
      fetchMembers();
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to update membership status' });
    }
  };

  // 5. DELETE: Open Confirmation Modal and Confirm Delete
  const openDeleteModal = (member) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMember) return;

    if (currentUser?._id && currentUser._id.toString() === selectedMember._id.toString()) {
      setFeedback({
        type: 'error',
        message: 'Security policy: You cannot delete your own active administrator account.',
      });
      setShowDeleteModal(false);
      return;
    }

    setSubmitting(true);
    try {
      await API.delete(`/admin/members/${selectedMember._id}`);
      setFeedback({
        type: 'success',
        message: `Member record for "${selectedMember.name}" successfully removed.`,
      });
      recordAdminAction({
        action: `Permanently removed member record for "${selectedMember.name}" (${selectedMember.memberId || 'GNPP ID'})`,
        category: 'Membership',
        severity: 'warning',
        adminName: currentUser?.name || 'Dr. K. V. Subba Rao',
      });
      setShowDeleteModal(false);
      setSelectedMember(null);
      fetchMembers();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to remove member record',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplicationDecision = async (memberId, newStatus, memberName) => {
    try {
      await API.patch(`/admin/members/${memberId}/membership`, { status: newStatus });
      setFeedback({
        type: 'success',
        message: `Membership application for "${memberName}" marked as ${newStatus}. Applicant notified.`,
      });
      recordAdminAction({
        action: `Updated membership application for "${memberName}" to ${newStatus}`,
        category: 'Membership',
        adminName: currentUser?.name || 'Dr. K. V. Subba Rao',
      });
      fetchMembers();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update application status',
      });
    }
  };

  // Update Membership Tier directly or review Volunteer request
  const handleTierChange = async (memberId, newTier, memberName) => {
    try {
      await API.patch(`/admin/members/${memberId}/membership`, {
        membershipType: newTier,
      });
      setFeedback({
        type: 'success',
        message: `Updated membership tier for "${memberName}" to ${newTier}.`,
      });
      recordAdminAction({
        action: `Changed membership tier for "${memberName}" to ${newTier}`,
        category: 'Membership',
        adminName: currentUser?.name || 'Dr. K. V. Subba Rao',
      });
      fetchMembers();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update membership tier',
      });
    }
  };

  const handleReviewTierRequest = async (memberId, action, requestedTier, memberName) => {
    try {
      const res = await API.patch(`/admin/members/${memberId}/tier-request`, {
        action,
        membershipType: requestedTier || 'Volunteer Member',
      });
      setFeedback({
        type: 'success',
        message:
          res.data?.message ||
          (action === 'approve'
            ? `Granted ${requestedTier || 'Volunteer Member'} access to "${memberName}".`
            : `Declined tier request for "${memberName}".`),
      });
      recordAdminAction({
        action: `${action === 'approve' ? 'Approved' : 'Declined'} ${requestedTier || 'Volunteer Member'} request for "${memberName}"`,
        category: 'Membership',
        adminName: currentUser?.name || 'Dr. K. V. Subba Rao',
      });
      fetchMembers();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to review tier request',
      });
    }
  };

  // Helper for Member Initials
  const getInitials = (name) => {
    if (!name) return 'M';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper for Badge Colors
  const getTierBadgeClass = (tier) => {
    switch (tier) {
      case 'Life Member':
        return 'ref-tier-life';
      case 'Annual Member':
        return 'ref-tier-annual';
      case 'Volunteer Member':
        return 'ref-tier-volunteer';
      case 'Patron':
        return 'ref-tier-life';
      default:
        return 'ref-tier-annual';
    }
  };

  // Client-Side Search & Multi-Filter Logic
  const filteredMembers = members.filter((m) => {
    const term = searchKeyword.toLowerCase();
    const nameMatch = m.name?.toLowerCase().includes(term);
    const emailMatch = m.email?.toLowerCase().includes(term);
    const phoneMatch = m.phone?.toLowerCase().includes(term);
    const idMatch = m.memberId?.toLowerCase().includes(term);
    const membershipNoMatch = m.membership?.membershipNumber?.toLowerCase().includes(term);
    const matchesSearch = !term || nameMatch || emailMatch || phoneMatch || idMatch || membershipNoMatch;

    const currentStatus = m.membership?.status || 'Active';
    const matchesStatus = statusFilter === 'All' || currentStatus === statusFilter;

    const currentTier = m.membership?.membershipType || m.membershipType || 'Annual Member';
    const matchesTier = tierFilter === 'All' || currentTier === tierFilter;

    const currentPayment = m.membership?.paymentStatus || 'Paid';
    const matchesPayment = paymentFilter === 'All' || currentPayment === paymentFilter;

    return matchesSearch && matchesStatus && matchesTier && matchesPayment;
  });

  // Dynamic KPI Stats
  const totalCount = members.length;
  const activeCount = members.filter((m) => (m.membership?.status || 'Active') === 'Active').length;
  const suspendedCount = members.filter((m) => (m.membership?.status || 'Active') === 'Suspended').length;
  const lifeCount = members.filter(
    (m) => (m.membership?.membershipType || m.membershipType) === 'Life Member'
  ).length;

  // =========================================================================
  // VIEW 1: COMPLETE FULL-WIDTH MEMBER DOSSIER PAGE (WITH SIDEBAR VISIBLE)
  // =========================================================================
  if (showViewModal && selectedMember) {
    return (
      <div className="ref-members-page">
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setShowViewModal(false)}
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
            <span>Back to Members Directory</span>
          </button>

          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Member Dossier &bull; {selectedMember.memberId || 'GNPP ID Pending'}
          </span>
        </div>

        {/* 1. Member Profile Identity Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            marginBottom: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid #f1f5f9',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '18px',
                  backgroundColor: '#064e3b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  boxShadow: '0 8px 20px rgba(6, 78, 59, 0.28)',
                }}
              >
                {getInitials(selectedMember.name)}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
                    {selectedMember.name}
                  </h2>
                  {selectedMember.bloodGroup && (
                    <span className="ref-tag-pill">{selectedMember.bloodGroup}</span>
                  )}
                  <span
                    className={`eco-tier-pill ${
                      (selectedMember.membership?.membershipType || selectedMember.membershipType) === 'Life Member'
                        ? 'eco-tier-life'
                        : 'eco-tier-annual'
                    }`}
                  >
                    <Star size={11} />
                    {selectedMember.membership?.membershipType || selectedMember.membershipType || 'Annual Member'}
                  </span>
                  <span
                    className={`ref-status-badge ${
                      (selectedMember.membership?.status || 'Active') === 'Active' ? 'active' : 'suspended'
                    }`}
                  >
                    <span className="ref-status-dot-inner"></span>
                    <span>{selectedMember.membership?.status || 'Active'}</span>
                  </span>
                </div>
                <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.9rem', color: '#059669', fontWeight: 600 }}>
                  {selectedMember.designation || 'General Member'} &bull;{' '}
                  <span style={{ color: '#64748b', fontWeight: 500 }}>
                    Godhavari Nadhi Paryavarana Parishubratha
                  </span>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => {
                  handleStatusToggle(
                    selectedMember._id,
                    selectedMember.membership?.status || 'Active',
                    selectedMember.name
                  );
                }}
                className={
                  (selectedMember.membership?.status || 'Active') === 'Active'
                    ? 'ref-btn-suspend-modal'
                    : 'ref-btn-activate-modal'
                }
                style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
              >
                {(selectedMember.membership?.status || 'Active') === 'Active' ? (
                  <>
                    <Pause size={13} strokeWidth={2.4} />
                    <span>Suspend Membership</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={13} strokeWidth={2.4} />
                    <span>Activate Membership</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedMember);
                }}
                className="ref-btn-enroll"
                style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
              >
                <Edit2 size={13} />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setShowViewModal(false)}
                className="ref-btn-refresh"
                style={{ fontSize: '0.82rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
              >
                <X size={15} />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* 12-Field Symmetrical Details Grid */}
          <div className="ref-details-grid" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
            <div className="ref-detail-item">
              <span className="ref-detail-label">Official Member ID</span>
              <span className="ref-detail-value">{selectedMember.memberId || 'N/A'}</span>
            </div>
            <div className="ref-detail-item">
              <span className="ref-detail-label">Membership Registry Number</span>
              <span className="ref-detail-value">
                {selectedMember.membership?.membershipNumber || `MEM-${selectedMember.memberId || 'N/A'}`}
              </span>
            </div>

            <div className="ref-detail-item">
              <span className="ref-detail-label">Email Address</span>
              <span className="ref-detail-value">{selectedMember.email}</span>
            </div>
            <div className="ref-detail-item">
              <span className="ref-detail-label">Primary Mobile Phone</span>
              <span className="ref-detail-value">{selectedMember.phone || 'Not provided'}</span>
            </div>

            <div className="ref-detail-item">
              <span className="ref-detail-label">Membership Category</span>
              <span className="ref-detail-value font-semibold text-emerald-800">
                {selectedMember.membership?.membershipType || selectedMember.membershipType || 'Annual Member'}
              </span>
            </div>
            <div className="ref-detail-item">
              <span className="ref-detail-label">Membership Status</span>
              <span className="ref-detail-value font-semibold">
                {selectedMember.membership?.status || 'Active'}
              </span>
            </div>

            <div className="ref-detail-item">
              <span className="ref-detail-label">Validity Period</span>
              <span className="ref-detail-value">
                {selectedMember.membership?.validTo
                  ? `Valid until ${new Date(selectedMember.membership.validTo).toLocaleDateString()}`
                  : (selectedMember.membership?.membershipType || selectedMember.membershipType) === 'Life Member'
                  ? 'Lifetime Membership (2051)'
                  : 'Valid (2026 - 2027)'}
              </span>
            </div>
            <div className="ref-detail-item">
              <span className="ref-detail-label">Registration Contribution</span>
              <span className="ref-detail-value font-bold text-emerald-700">
                ₹{(selectedMember.membership?.feePaid ?? ((selectedMember.membership?.membershipType || selectedMember.membershipType) === 'Life Member' ? 5000 : 500)).toLocaleString()}{' '}
                <span className="text-xs font-normal text-emerald-600">
                  ({selectedMember.membership?.paymentStatus || 'Paid'})
                </span>
              </span>
            </div>

            <div className="ref-detail-item">
              <span className="ref-detail-label">Blood Group</span>
              <span className="ref-detail-value">{selectedMember.bloodGroup || 'O+'}</span>
            </div>
            <div className="ref-detail-item">
              <span className="ref-detail-label">City / Headquarters</span>
              <span className="ref-detail-value">{selectedMember.address?.city || 'Rajahmundry'}</span>
            </div>

            <div className="ref-detail-item">
              <span className="ref-detail-label">Physical Address</span>
              <span className="ref-detail-value">
                {selectedMember.address?.street
                  ? `${selectedMember.address.street}, ${selectedMember.address.city || 'Rajahmundry'}`
                  : 'Godavari Bund Road, Near Kotilingala Ghat, Rajahmundry'}
              </span>
            </div>
            <div className="ref-detail-item">
              <span className="ref-detail-label">Portal Security Role</span>
              <span className="ref-detail-value capitalize">{selectedMember.role || 'Member'}</span>
            </div>
          </div>
        </div>

        {/* 2. Digital Executive Member ID Card Preview */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <ShieldCheck size={20} className="text-emerald-700" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              Official Member Identification Card
            </h3>
          </div>

          <div className="ref-id-card-wrap" style={{ maxWidth: '480px' }}>
            <div className="ref-id-card-top">
              <div>
                <div className="ref-id-card-title">Godhavari Nadhi Paryavarana Parishubratha</div>
                <div className="ref-id-card-org">Official Riverfront Steward Pass</div>
              </div>
              <span className="ref-pass-id-chip">{selectedMember.memberId || 'GNPP-2026-0000'}</span>
            </div>
            <div className="ref-id-card-mid">
              <div className="ref-id-card-avatar">
                {getInitials(selectedMember.name)}
              </div>
              <div className="ref-id-card-info">
                <span className="ref-id-card-name">{selectedMember.name}</span>
                <span className="ref-id-card-designation">{selectedMember.designation || 'General Member'}</span>
              </div>
            </div>
            <div className="ref-id-card-bottom">
              <div className="ref-id-card-meta">
                <span className="ref-id-card-meta-lbl">Category Tier</span>
                <span className="ref-id-card-meta-val">
                  {selectedMember.membership?.membershipType || selectedMember.membershipType || 'Annual Member'}
                </span>
              </div>
              <div className="ref-id-card-meta">
                <span className="ref-id-card-meta-lbl">Validity</span>
                <span className="ref-id-card-meta-val">
                  {selectedMember.membership?.validTo
                    ? new Date(selectedMember.membership.validTo).toLocaleDateString()
                    : 'Lifetime Access'}
                </span>
              </div>
              <div className="ref-id-card-meta">
                <span className="ref-id-card-meta-lbl">Status</span>
                <span className="ref-id-card-meta-val">Verified Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Return Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setShowViewModal(false)}
            className="ref-btn-enroll"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              padding: '0.6rem 1.35rem',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            <span>Return to Members Directory</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ref-members-page">
      {/* 1. Header (Unified Members & Membership Directory, No Refresh Button) */}
      <div className="ref-members-header no-print">
        <div className="ref-header-left">
          <div className="ref-header-icon-box">
            <Users size={24} />
          </div>
          <div className="ref-header-text">
            <h2>Members & Membership Directory</h2>
            <p>Comprehensive registry of all registered NGO members, membership tiers, validity periods, contact records, and contribution statuses.</p>
          </div>
        </div>

        <div className="ref-header-actions">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="ref-btn-enroll"
            title="Enroll new member and configure membership tier"
          >
            <Plus size={16} />
            <span>Enroll New Member</span>
          </button>
        </div>
      </div>

      {/* 2. Feedback Notification Toast */}
      {feedback.message && (
        <div
          className={`ref-feedback-toast ${
            feedback.type === 'error' ? 'error' : 'success'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'error' ? (
              <AlertTriangle size={16} className="text-red-600" />
            ) : (
              <CheckCircle size={16} className="text-emerald-600" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback({ type: '', message: '' })}
            className="ref-feedback-close"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Pending Membership Applications */}
      {members.some((m) => m.membership?.status === 'Pending' || m.membership?.status === 'Pending Approval') && (
        <div
          style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.9rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={16} />
            <span>Pending Membership Applications</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {members
              .filter((m) => m.membership?.status === 'Pending' || m.membership?.status === 'Pending Approval')
              .map((m) => (
                <div
                  key={m._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    background: '#ffffff',
                    border: '1px solid #dbeafe',
                    borderRadius: '10px',
                    padding: '0.6rem 0.9rem',
                  }}
                >
                  <div style={{ fontSize: '0.84rem', color: '#1e293b' }}>
                    <strong>{m.name}</strong> ({m.memberId || m.email}) &bull;{' '}
                    <span style={{ fontWeight: 600 }}>{m.membership?.membershipType || 'Annual Member'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleApplicationDecision(m._id, 'Approved', m.name)}
                      style={{
                        background: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.38rem 0.8rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplicationDecision(m._id, 'Rejected', m.name)}
                      style={{
                        background: '#fee2e2',
                        color: '#b91c1c',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.38rem 0.75rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Pending Volunteer / Tier Upgrade Requests */}
      {members.some((m) => m.membership?.tierRequestStatus === 'Pending') && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fcd34d',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ fontWeight: 700, color: '#92400e', fontSize: '0.9rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} />
            <span>Pending Volunteer &amp; Membership Tier Requests</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {members
              .filter((m) => m.membership?.tierRequestStatus === 'Pending')
              .map((m) => {
                const reqTier = m.membership?.requestedTier || 'Volunteer Member';
                return (
                  <div
                    key={m._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                      background: '#ffffff',
                      border: '1px solid #fde68a',
                      borderRadius: '10px',
                      padding: '0.6rem 0.9rem',
                    }}
                  >
                    <div style={{ fontSize: '0.84rem', color: '#1e293b' }}>
                      <strong>{m.name}</strong> ({m.memberId || m.email}) requested upgrade from{' '}
                      <span style={{ fontWeight: 600 }}>{m.membership?.membershipType || 'Annual Member'}</span> to{' '}
                      <span style={{ fontWeight: 700, color: '#047857' }}>{reqTier}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleReviewTierRequest(m._id, 'approve', reqTier, m.name)}
                        style={{
                          background: '#059669',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.38rem 0.8rem',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Grant {reqTier}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReviewTierRequest(m._id, 'reject', reqTier, m.name)}
                        style={{
                          background: '#fee2e2',
                          color: '#b91c1c',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.38rem 0.75rem',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 3. 4-Card Pastel KPI Metric Strip */}
      <div className="ref-kpi-grid">
        {/* Card 1: Total Enrolled */}
        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-blue">
            <Users size={20} className="text-blue-600" />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-value">{totalCount}</span>
            <span className="ref-kpi-label">Total Members</span>
          </div>
        </div>

        {/* Card 2: Active Members */}
        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-green">
            <CheckCircle size={20} className="text-emerald-600" />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-value">{activeCount}</span>
            <span className="ref-kpi-label">Active Members</span>
          </div>
        </div>

        {/* Card 3: Suspended Members */}
        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-orange">
            <Pause size={20} className="text-amber-600" />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-value">{suspendedCount}</span>
            <span className="ref-kpi-label">Suspended Members</span>
          </div>
        </div>

        {/* Card 4: Life Members */}
        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-purple">
            <Star size={20} className="text-purple-600" fill="#9333ea" />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-value">{lifeCount}</span>
            <span className="ref-kpi-label">Life Members</span>
          </div>
        </div>
      </div>

      {/* 4. Filter & Search Toolbar (Single Horizontal Row) */}
      <div className="ref-filter-card">
        <div className="ref-search-wrap">
          <Search size={16} className="ref-search-icon" />
          <input
            type="text"
            placeholder="Search by member name, email, phone, or Member ID..."
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
          {/* Tier Filter */}
          <div className="ref-select-item">
            <span className="ref-select-label">Tier:</span>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="ref-select-input"
            >
              <option value="All">All Tiers</option>
              <option value="Life Member">Life Member</option>
              <option value="Annual Member">Annual Member</option>
              <option value="Volunteer Member">Volunteer Member</option>
              <option value="Student Member">Student Member</option>
              <option value="Patron">Patron</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="ref-select-item">
            <span className="ref-select-label">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="ref-select-input"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="ref-select-item">
            <span className="ref-select-label">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="ref-select-input"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Waived">Waived</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Clean View Switcher Navigation Tabs */}
      <div className="ref-tab-nav">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`ref-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
        >
          <Sparkles size={14} />
          <span>Unified Registry (All Details)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('directory')}
          className={`ref-tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
        >
          <Users size={14} />
          <span>Directory & Profiles</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('membership')}
          className={`ref-tab-btn ${activeTab === 'membership' ? 'active' : ''}`}
        >
          <CreditCard size={14} />
          <span>Tiers & Renewals</span>
        </button>
      </div>

      {/* 6. Comprehensive Members & Membership Data Table */}
      <div className="ref-table-card">
        {loading ? (
          <div className="p-12 text-center text-muted">
            <RefreshCw size={26} className="animate-spin inline mb-2 text-emerald-700" />
            <p className="font-semibold text-slate-700 text-sm">Loading member & membership records...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center text-muted">
            <Users size={32} className="mx-auto mb-2 opacity-40 text-slate-500" />
            <p className="font-semibold text-sm text-slate-700 mb-1">
              No members found matching your search criteria.
            </p>
            <span className="text-xs text-slate-500">
              Try adjusting your search terms or filters above.
            </span>
          </div>
        ) : (
          <div className="ref-table-responsive">
            <table className="ref-table">
              {/* TAB 1: ALL DETAILS (UNIFIED) */}
              {activeTab === 'all' && (
                <>
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>MEMBER DETAILS</th>
                      <th style={{ width: '13.5%' }}>MEMBER ID</th>
                      <th style={{ width: '21%' }}>CONTACT INFORMATION</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>MEMBERSHIP TIER</th>
                      <th style={{ width: '10%', textAlign: 'center' }}>STATUS</th>
                      <th style={{ width: '12.5%' }}>VALIDITY & FEE</th>
                      <th style={{ width: '11%', textAlign: 'center' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((m) => {
                      const status = m.membership?.status || 'Active';
                      const tier = m.membership?.membershipType || m.membershipType || 'Annual Member';

                      return (
                        <tr key={m._id}>
                          {/* 1. Member Details */}
                          <td>
                            <div
                              className="ref-profile-cell cursor-pointer"
                              onClick={() => openViewModal(m)}
                              title="Click to view full membership profile and official ID card"
                            >
                              <div className="ref-avatar-circle">
                                {getInitials(m.name)}
                              </div>
                              <div className="ref-profile-info">
                                <div className="ref-name-row">
                                  <span className="ref-member-name hover:text-emerald-700 transition">
                                    {m.name}
                                  </span>
                                  {m.bloodGroup && (
                                    <span className="ref-tag-pill">{m.bloodGroup}</span>
                                  )}
                                </div>
                                <div className="ref-member-role">
                                  {m.designation || 'General Member'}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Member ID */}
                          <td>
                            <span className="ref-id-pill">
                              {m.memberId || m.membership?.membershipNumber || 'N/A'}
                            </span>
                          </td>

                          {/* 3. Contact Information */}
                          <td>
                            <div className="ref-contact-col">
                              <div className="ref-contact-item" title={m.email}>
                                <Mail size={12} className="text-slate-400 flex-shrink-0" />
                                <span>{m.email}</span>
                              </div>
                              <div className="ref-contact-item ref-contact-sub" title={m.phone || 'No phone'}>
                                <Phone size={12} className="text-slate-400 flex-shrink-0" />
                                <span>{m.phone || 'Not provided'}</span>
                              </div>
                            </div>
                          </td>

                          {/* 4. Membership Tier */}
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                              <select
                                value={tier}
                                onChange={(e) => handleTierChange(m._id, e.target.value, m.name)}
                                className={`ref-tier-badge ${getTierBadgeClass(tier)}`}
                                style={{
                                  cursor: 'pointer',
                                  border: '1px solid rgba(0,0,0,0.08)',
                                  fontWeight: 700,
                                  fontSize: '0.74rem',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '9999px',
                                }}
                                title="Change membership tier"
                              >
                                <option value="Annual Member">Annual Member</option>
                                <option value="Life Member">Life Member</option>
                                <option value="Volunteer Member">Volunteer Member</option>
                                <option value="Patron">Patron</option>
                                <option value="Student Member">Student Member</option>
                              </select>
                              {m.membership?.tierRequestStatus === 'Pending' && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleReviewTierRequest(
                                      m._id,
                                      'approve',
                                      m.membership?.requestedTier || 'Volunteer Member',
                                      m.name
                                    )
                                  }
                                  style={{
                                    background: '#fef3c7',
                                    color: '#92400e',
                                    border: '1px solid #fcd34d',
                                    borderRadius: '9999px',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    padding: '0.15rem 0.5rem',
                                    cursor: 'pointer',
                                  }}
                                  title="Click to grant requested tier access"
                                >
                                  Approve {m.membership?.requestedTier || 'Volunteer'}
                                </button>
                              )}
                            </div>
                          </td>

                          {/* 5. Status (Interactive Toggle) */}
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleStatusToggle(m._id, status, m.name)}
                              className={`ref-status-badge ${
                                status === 'Active' ? 'active' : 'suspended'
                              }`}
                              title={`Status is ${status}. Click to ${
                                status === 'Active' ? 'Suspend' : 'Activate'
                              }`}
                            >
                              <span className="ref-status-dot-inner"></span>
                              <span>{status}</span>
                            </button>
                          </td>

                          {/* 6. Validity & Fee (Compact, Crisp, Never Broken) */}
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                              <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                                {m.membership?.validTo
                                  ? new Date(m.membership.validTo).toLocaleDateString()
                                  : tier === 'Life Member'
                                  ? 'Lifetime'
                                  : '1/1/2051'}
                              </span>
                              <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">
                                ₹{(m.membership?.feePaid ?? (tier === 'Life Member' ? 5000 : 500)).toLocaleString()}{' '}
                                <span className="text-[11px] font-semibold text-emerald-600">
                                  • {m.membership?.paymentStatus || 'Paid'}
                                </span>
                              </span>
                            </div>
                          </td>

                          {/* 7. Actions */}
                          <td style={{ textAlign: 'center' }}>
                            <div className="ref-actions-container" style={{ justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => openViewModal(m)}
                                className="ref-act-btn view"
                                title="View Complete Member & Membership Dossier"
                                aria-label="View Details"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(m)}
                                className="ref-act-btn edit"
                                title="Edit Member Profile & Membership"
                                aria-label="Edit Profile"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteModal(m)}
                                className="ref-act-btn delete"
                                title="Delete Member Record"
                                aria-label="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              )}

              {/* TAB 2: DIRECTORY & PROFILES */}
              {activeTab === 'directory' && (
                <>
                  <thead>
                    <tr>
                      <th style={{ width: '23%' }}>MEMBER DETAILS</th>
                      <th style={{ width: '14%' }}>MEMBER ID</th>
                      <th style={{ width: '24%' }}>CONTACT INFORMATION</th>
                      <th style={{ width: '14%', textAlign: 'center' }}>MEMBERSHIP TIER</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>STATUS</th>
                      <th style={{ width: '13%', textAlign: 'center' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((m) => {
                      const status = m.membership?.status || 'Active';
                      const tier = m.membership?.membershipType || m.membershipType || 'Annual Member';

                      return (
                        <tr key={m._id}>
                          <td>
                            <div
                              className="ref-profile-cell cursor-pointer"
                              onClick={() => openViewModal(m)}
                              title="Click to view full membership profile and official ID card"
                            >
                              <div className="ref-avatar-circle">
                                {getInitials(m.name)}
                              </div>
                              <div className="ref-profile-info">
                                <div className="ref-name-row">
                                  <span className="ref-member-name hover:text-emerald-700 transition">
                                    {m.name}
                                  </span>
                                  {m.bloodGroup && (
                                    <span className="ref-tag-pill">{m.bloodGroup}</span>
                                  )}
                                </div>
                                <div className="ref-member-role">
                                  {m.designation || 'General Member'}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="ref-id-pill">
                              {m.memberId || m.membership?.membershipNumber || 'N/A'}
                            </span>
                          </td>

                          <td>
                            <div className="ref-contact-col">
                              <div className="ref-contact-item" title={m.email}>
                                <Mail size={12} className="text-slate-400 flex-shrink-0" />
                                <span>{m.email}</span>
                              </div>
                              <div className="ref-contact-item ref-contact-sub" title={m.phone || 'No phone'}>
                                <Phone size={12} className="text-slate-400 flex-shrink-0" />
                                <span>{m.phone || 'Not provided'}</span>
                              </div>
                            </div>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <span className={`ref-tier-badge ${getTierBadgeClass(tier)}`}>
                              {tier === 'Life Member' ? (
                                <Star size={11} fill="#9333ea" />
                              ) : (
                                <User size={11} />
                              )}
                              <span>{tier}</span>
                            </span>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleStatusToggle(m._id, status, m.name)}
                              className={`ref-status-badge ${
                                status === 'Active' ? 'active' : 'suspended'
                              }`}
                              title={`Status is ${status}. Click to ${
                                status === 'Active' ? 'Suspend' : 'Activate'
                              }`}
                            >
                              <span className="ref-status-dot-inner"></span>
                              <span>{status}</span>
                            </button>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <div className="ref-actions-container" style={{ justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => openViewModal(m)}
                                className="ref-act-btn view"
                                title="View Member Dossier"
                                aria-label="View Details"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(m)}
                                className="ref-act-btn edit"
                                title="Edit Member Profile"
                                aria-label="Edit Profile"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteModal(m)}
                                className="ref-act-btn delete"
                                title="Delete Member Record"
                                aria-label="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              )}

              {/* TAB 3: TIERS & RENEWALS */}
              {activeTab === 'membership' && (
                <>
                  <thead>
                    <tr>
                      <th style={{ width: '20%' }}>MEMBER NAME</th>
                      <th style={{ width: '13.5%' }}>MEMBER ID</th>
                      <th style={{ width: '14%' }}>TIER / TYPE</th>
                      <th style={{ width: '11.5%', textAlign: 'center' }}>STATUS</th>
                      <th style={{ width: '13%' }}>VALID UNTIL</th>
                      <th style={{ width: '15%' }}>FEE & PAYMENT</th>
                      <th style={{ width: '13%', textAlign: 'center' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((m) => {
                      const status = m.membership?.status || 'Active';
                      const tier = m.membership?.membershipType || m.membershipType || 'Annual Member';

                      return (
                        <tr key={m._id}>
                          <td>
                            <div
                              className="ref-profile-cell cursor-pointer"
                              onClick={() => openViewModal(m)}
                              title="Click to view full membership profile"
                            >
                              <div className="ref-avatar-circle">
                                {getInitials(m.name)}
                              </div>
                              <div className="ref-profile-info">
                                <span className="ref-member-name hover:text-emerald-700 transition">
                                  {m.name}
                                </span>
                                <div className="text-xs text-slate-500 font-medium" style={{ marginTop: '0.15rem' }}>
                                  {m.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="ref-id-pill">
                              {m.memberId || m.membership?.membershipNumber || 'N/A'}
                            </span>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <span className={`ref-tier-badge ${getTierBadgeClass(tier)}`}>
                              {tier === 'Life Member' ? (
                                <Star size={12} fill="#9333ea" />
                              ) : (
                                <User size={12} />
                              )}
                              <span>{tier}</span>
                            </span>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleStatusToggle(m._id, status, m.name)}
                              className={`ref-status-badge ${
                                status === 'Active' ? 'active' : 'suspended'
                              }`}
                              title={`Status is ${status}. Click to ${
                                status === 'Active' ? 'Suspend' : 'Activate'
                              }`}
                            >
                              <span className="ref-status-dot-inner"></span>
                              <span>{status}</span>
                            </button>
                          </td>

                          <td>
                            <span className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                              {m.membership?.validTo
                                ? new Date(m.membership.validTo).toLocaleDateString()
                                : tier === 'Life Member'
                                ? 'Lifetime'
                                : '1/1/2051'}
                            </span>
                          </td>

                          <td>
                            <span className="font-bold text-slate-900 text-xs whitespace-nowrap">
                              ₹{(m.membership?.feePaid ?? (tier === 'Life Member' ? 5000 : 500)).toLocaleString()}{' '}
                              <span className="ref-payment-paid text-[11px] font-semibold ml-1">
                                ({m.membership?.paymentStatus || 'Paid'})
                              </span>
                            </span>
                          </td>

                          <td style={{ textAlign: 'center' }}>
                            <div className="ref-actions-container" style={{ justifyContent: 'center' }}>
                              <button
                                type="button"
                                onClick={() => openViewModal(m)}
                                className="ref-act-btn view"
                                title="View Membership Dossier"
                                aria-label="View Details"
                              >
                                <Eye size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditModal(m)}
                                className="ref-act-btn edit"
                                title="Edit Membership Details"
                                aria-label="Edit Profile"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteModal(m)}
                                className="ref-act-btn delete"
                                title="Delete Member Record"
                                aria-label="Delete Record"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              )}
            </table>
          </div>
        )}

        {/* 7. Table Card Footer: Summary & Pagination */}
        <div className="ref-table-footer">
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredMembers.length} of {members.length} registered members
          </span>
          <div className="ref-table-pagination">
            <button className="ref-page-btn" title="Previous Page" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="ref-page-btn active">1</button>
            <button className="ref-page-btn" title="Next Page" disabled>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: CREATE (Enroll New Member & Setup Membership)
          ========================================================================= */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="ref-modal-dialog" style={{ maxWidth: '620px' }}>
            <div className="ref-modal-header">
              <div className="ref-modal-title-wrap">
                <h3 className="ref-modal-title">Enroll New Member & Set Up Membership</h3>
                <span className="ref-modal-badge">Direct Secretariat Registration</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="ref-modal-close-btn"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMember}>
              <div className="ref-modal-body">
                {/* Section 1: Member Personal Details */}
                <div className="ref-form-section-title">
                  <User size={14} className="text-emerald-700" />
                  <span>Member Identity & Secretariat Contact</span>
                </div>

                <div className="ref-form-grid-2">
                  <div className="ref-form-field">
                    <label className="ref-form-label">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Srikanth Varma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="ref-form-input"
                    />
                  </div>
                  <div className="ref-form-field">
                    <label className="ref-form-label">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. srikanth@godhavari.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="ref-form-input"
                    />
                  </div>
                </div>

                <div className="ref-form-grid-2">
                  <div className="ref-form-field">
                    <label className="ref-form-label">Primary Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98480 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="ref-form-input"
                    />
                  </div>
                  <div className="ref-form-field">
                    <label className="ref-form-label">Designation / Executive Role *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Staff Coordinator / Volunteer Lead"
                      value={formData.designation}
                      onChange={(e) =>
                        setFormData({ ...formData, designation: e.target.value })
                      }
                      className="ref-form-input"
                    />
                  </div>
                </div>

                {/* Section 2: Membership Parameters */}
                <div className="ref-form-section-title mt-4">
                  <CreditCard size={14} className="text-emerald-700" />
                  <span>Membership Tier, Validity & Contribution</span>
                </div>

                <div className="ref-form-grid-2">
                  <div className="ref-form-field">
                    <label className="ref-form-label">Membership Category (Tier) *</label>
                    <select
                      value={formData.membershipType}
                      onChange={(e) => handleTierChangeInAdd(e.target.value)}
                      className="ref-form-select"
                    >
                      <option value="Annual Member">Annual Member (₹500/year)</option>
                      <option value="Life Member">Life Member (₹5,000 Lifetime)</option>
                      <option value="Volunteer Member">Volunteer Member (₹0 Free)</option>
                      <option value="Student Member">Student Member (₹250/year)</option>
                      <option value="Patron">Patron Tier (₹10,000)</option>
                    </select>
                  </div>
                  <div className="ref-form-field">
                    <label className="ref-form-label">Initial Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="ref-form-select"
                    >
                      <option value="Active">Active (Verified & In Good Standing)</option>
                      <option value="Pending Approval">Pending Approval</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="ref-form-grid-2">
                  <div className="ref-form-field">
                    <label className="ref-form-label">Registration Fee Paid (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.feePaid}
                      onChange={(e) => setFormData({ ...formData, feePaid: e.target.value })}
                      className="ref-form-input"
                    />
                  </div>
                  <div className="ref-form-field">
                    <label className="ref-form-label">Payment Status</label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      className="ref-form-select"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Waived">Waived</option>
                    </select>
                  </div>
                </div>

                <div className="ref-form-grid-2">
                  <div className="ref-form-field">
                    <label className="ref-form-label">Blood Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="ref-form-select"
                    >
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="O+">O+</option>
                      <option value="AB+">AB+</option>
                      <option value="A-">A-</option>
                      <option value="B-">B-</option>
                      <option value="O-">O-</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="ref-form-field">
                    <label className="ref-form-label">City / Headquarters</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajahmundry"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="ref-form-input"
                    />
                  </div>
                </div>

                <div className="ref-form-field">
                  <label className="ref-form-label">Street / Location Address</label>
                  <input
                    type="text"
                    placeholder="e.g. Godavari Bund Road, Near Kotilingala Ghat"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="ref-form-input"
                  />
                </div>
              </div>

              <div className="ref-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="ref-modal-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="ref-modal-btn-save"
                >
                  {submitting ? 'Enrolling...' : 'Enroll Member & Issue Membership'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* =========================================================================
          MODAL 3: UPDATE (Edit Member Profile & Membership Details)
          ========================================================================= */}
      {showEditModal && selectedMember && (
        <div className="modal-backdrop">
          <div className="ref-modal-dialog" style={{ maxWidth: '620px' }}>
            <div className="ref-modal-header">
              <div className="ref-modal-title-wrap">
                <h3 className="ref-modal-title">Edit Member & Membership Record</h3>
                <span className="ref-modal-badge">{selectedMember.memberId || 'ID Pending'}</span>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="ref-modal-close-btn"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="ref-modal-body">
                {/* Section 1: Member Personal Details */}
                <div className="ref-form-section-title">
                  <User size={14} className="text-emerald-700" />
                  <span>Member Identity & Secretariat Contact</span>
                </div>

                <div className="ref-form-grid-2">
                  <div className="ref-form-field">
                    <label className="ref-form-label">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="ref-form-input"
                    />
                  </div>
                  <div className="ref-form-field">
                    <label className="ref-form-label">Official Email Address *</label>
                    <input
                      type="email"
                      required
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="ref-form-input"
                    />
                  </div>
                </div>

                <div className="ref-form-grid-2">
                  <div className="ref-form-field">
                    <label className="ref-form-label">Primary Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="ref-form-input"
                    />
                  </div>
                  <div className="ref-form-field">
                    <label className="ref-form-label">Designation / Executive Role *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.designation}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, designation: e.target.value })
                      }
                      className="ref-form-input"
                    />
                  </div>
                </div>

                {/* Section 2: Membership Parameters */}
                <div className="ref-form-section-title mt-4">
                  <CreditCard size={14} className="text-emerald-700" />
                  <span>Membership Tier, Validity & Contribution</span>
                </div>

                <div className="ref-form-grid-2">
                  <div className="ref-form-field">
                    <label className="ref-form-label">Membership Category (Tier)</label>
                    <select
                      value={editFormData.membershipType}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, membershipType: e.target.value })
                      }
                      className="ref-form-select"
                    >
                      <option value="Annual Member">Annual Member (₹500/year)</option>
                      <option value="Life Member">Life Member (₹5,000 Lifetime)</option>
                      <option value="Volunteer Member">Volunteer Member (₹0 Free)</option>
                      <option value="Student Member">Student Member (₹250/year)</option>
                      <option value="Patron">Patron Tier (₹10,000)</option>
                    </select>
                  </div>
                  <div className="ref-form-field">
                    <label className="ref-form-label">Membership Status</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, status: e.target.value })
                      }
                      className="ref-form-select"
                    >
                      <option value="Active">Active (In Good Standing)</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Pending Approval">Pending Approval</option>
                      <option value="Expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="ref-form-grid-2">
                  <div className="ref-form-field">
                    <label className="ref-form-label">Registration Fee Paid (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={editFormData.feePaid}
                      onChange={(e) => setEditFormData({ ...editFormData, feePaid: e.target.value })}
                      className="ref-form-input"
                    />
                  </div>
                  <div className="ref-form-field">
                    <label className="ref-form-label">Payment Status</label>
                    <select
                      value={editFormData.paymentStatus}
                      onChange={(e) => setEditFormData({ ...editFormData, paymentStatus: e.target.value })}
                      className="ref-form-select"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Waived">Waived</option>
                    </select>
                  </div>
                </div>

                <div className="ref-form-grid-2">
                  <div className="ref-form-field">
                    <label className="ref-form-label">Valid Until Date</label>
                    <input
                      type="date"
                      value={editFormData.validTo}
                      onChange={(e) => setEditFormData({ ...editFormData, validTo: e.target.value })}
                      className="ref-form-input"
                    />
                  </div>
                  <div className="ref-form-field">
                    <label className="ref-form-label">Blood Group</label>
                    <select
                      value={editFormData.bloodGroup}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, bloodGroup: e.target.value })
                      }
                      className="ref-form-select"
                    >
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="O+">O+</option>
                      <option value="AB+">AB+</option>
                      <option value="A-">A-</option>
                      <option value="B-">B-</option>
                      <option value="O-">O-</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="ref-form-grid-2">
                  <div className="ref-form-field">
                    <label className="ref-form-label">City / Headquarters</label>
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      className="ref-form-input"
                    />
                  </div>
                  <div className="ref-form-field">
                    <label className="ref-form-label">Street / Location Address</label>
                    <input
                      type="text"
                      value={editFormData.street}
                      onChange={(e) => setEditFormData({ ...editFormData, street: e.target.value })}
                      className="ref-form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="ref-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="ref-modal-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="ref-modal-btn-save"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: DELETE (Confirmation Dialog)
          ========================================================================= */}
      {showDeleteModal && selectedMember && (
        <div className="modal-backdrop">
          <div className="ref-modal-dialog" style={{ maxWidth: '480px' }}>
            <div className="ref-modal-header">
              <div className="ref-modal-title-wrap">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <AlertTriangle size={18} />
                </div>
                <h3 className="ref-modal-title text-red-600">Delete Member Record</h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="ref-modal-close-btn"
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="ref-modal-body">
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                Are you sure you want to permanently remove the member record for{' '}
                <strong className="text-slate-900">{selectedMember.name}</strong>{' '}
                ({selectedMember.memberId || 'GNPP ID Pending'})?
              </p>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 leading-normal">
                <strong>Warning:</strong> This will revoke the member's portal access, deactivate their official digital ID card, and remove associated membership and renewal records.
              </div>
            </div>

            <div className="ref-modal-footer">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="ref-modal-btn-cancel"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="ref-btn-delete-confirm"
                disabled={submitting}
              >
                {submitting ? 'Removing...' : 'Delete Member Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;
