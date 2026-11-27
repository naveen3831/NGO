import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { recordAdminAction } from '../../services/auditService';
import { uploadImageToCloud } from '../../utils/imageUtils';
import {
  Megaphone,
  Plus,
  Trash2,
  Edit2,
  Eye,
  X,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Calendar,
  Lock,
  Globe,
  Bell,
  Sparkles,
  ChevronRight,
  Clock,
  User,
  FileText,
  Send,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingAnnouncement, setViewingAnnouncement] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterAudience, setFilterAudience] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General Update',
    priority: 'Normal',
    visibility: 'All',
    imageUrl: '',
  });

  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    category: 'General Update',
    priority: 'Normal',
    visibility: 'All',
    imageUrl: '',
  });

  const handleImageFileChange = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setFeedback({ type: '', text: '' });
    try {
      const uploaded = await uploadImageToCloud(file, 'announcements', '/admin/upload');
      if (isEdit) {
        setEditFormData((prev) => ({ ...prev, imageUrl: uploaded.url }));
      } else {
        setFormData((prev) => ({ ...prev, imageUrl: uploaded.url }));
      }
      setFeedback({ type: 'success', text: 'Announcement image uploaded to Cloudinary.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to upload image to Cloudinary.',
      });
    }
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/announcements');
      setAnnouncements(data || []);
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to load announcements from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // 1. CREATE
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/admin/announcements', formData);
      setFeedback({ type: 'success', text: `Announcement "${formData.title}" published successfully!` });
      setShowAddModal(false);
      recordAdminAction({
        action: `Published circular announcement "${formData.title}"`,
        category: 'Announcements',
      });
      setFormData({
        title: '',
        content: '',
        category: 'General Update',
        priority: 'Normal',
        visibility: 'All',
        imageUrl: '',
      });
      fetchAnnouncements();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to publish announcement.' });
    } finally {
      setSubmitting(false);
    }
  };

  // 2. READ (View Details)
  const openViewModal = (item) => {
    setViewingAnnouncement(item);
  };

  // 3. UPDATE (Edit)
  const openEditModal = (item) => {
    setEditingAnnouncement(item);
    setEditFormData({
      title: item.title || '',
      content: item.content || '',
      category: item.category || 'General Update',
      priority: item.priority || 'Normal',
      visibility: item.visibility || 'All',
      imageUrl: item.imageUrl || '',
    });
  };

  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();
    if (!editingAnnouncement) return;
    setSubmitting(true);
    try {
      await API.patch(`/admin/announcements/${editingAnnouncement._id}`, editFormData);
      setFeedback({ type: 'success', text: `Announcement "${editFormData.title}" updated successfully!` });
      setEditingAnnouncement(null);
      recordAdminAction({
        action: `Updated announcement circular "${editFormData.title}"`,
        category: 'Announcements',
      });
      fetchAnnouncements();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to update announcement.' });
    } finally {
      setSubmitting(false);
    }
  };

  // 4. DELETE
  const openDeleteModal = (item) => {
    setDeletingAnnouncement(item);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAnnouncement) return;
    setSubmitting(true);
    try {
      await API.delete(`/admin/announcements/${deletingAnnouncement._id}`);
      setFeedback({ type: 'success', text: `Announcement "${deletingAnnouncement.title}" deleted successfully.` });
      recordAdminAction({
        action: `Deleted announcement circular "${deletingAnnouncement.title}"`,
        category: 'Announcements',
        severity: 'warning',
      });
      setDeletingAnnouncement(null);
      fetchAnnouncements();
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to delete announcement.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Filter & Search Logic
  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      !search ||
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.content?.toLowerCase().includes(search.toLowerCase()) ||
      a.category?.toLowerCase().includes(search.toLowerCase());

    const matchesPriority = filterPriority === 'All' || a.priority === filterPriority;
    const matchesCategory = filterCategory === 'All' || a.category === filterCategory;
    const matchesAudience = filterAudience === 'All' || a.visibility === filterAudience;

    return matchesSearch && matchesPriority && matchesCategory && matchesAudience;
  });

  const resetFilters = () => {
    setSearch('');
    setFilterPriority('All');
    setFilterCategory('All');
    setFilterAudience('All');
  };

  const hasActiveFilters =
    search !== '' || filterPriority !== 'All' || filterCategory !== 'All' || filterAudience !== 'All';

  // Dynamic KPI Stats
  const totalCount = announcements.length;
  const urgentCount = announcements.filter((a) => a.priority === 'Urgent').length;
  const updateCount = announcements.filter((a) => a.category === 'General Update').length;
  const memberOnlyCount = announcements.filter((a) => a.visibility === 'Members Only').length;

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'eco-priority-urgent';
      case 'Important':
        return 'eco-priority-important';
      default:
        return 'eco-priority-normal';
    }
  };

  const getCategoryBadgeClass = (cat) => {
    switch (cat) {
      case 'Cleanliness Alert':
        return 'eco-tier-volunteer';
      case 'General Update':
        return 'eco-tier-annual';
      case 'Meeting Circular':
        return 'eco-tier-patron';
      case 'Event Notice':
        return 'eco-tier-student';
      case 'Press Release':
        return 'eco-tier-life';
      default:
        return 'eco-tier-annual';
    }
  };

  // =========================================================================
  // FULL PAGE VIEW 1: COMPLETE DELETE CONFIRMATION (PERSISTENT SIDEBAR)
  // =========================================================================
  if (deletingAnnouncement) {
    return (
      <div className="ref-members-page">
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setDeletingAnnouncement(null)}
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
            <span>Return to Announcements</span>
          </button>

          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Announcements &bull; Permanent Removal Confirmation
          </span>
        </div>

        {/* Full-Width Danger Deletion Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #fee2e2',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.05)',
          }}
        >
          {/* Header Strip */}
          <div
            style={{
              padding: '1.5rem 1.75rem',
              borderBottom: '1px solid #fee2e2',
              backgroundColor: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#991b1b', margin: 0 }}>
                Delete Announcement
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#b91c1c', margin: '0.2rem 0 0 0' }}>
                Please review this bulletin carefully. Are you sure you want to permanently delete this announcement?
              </p>
            </div>
          </div>

          {/* Details Body */}
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className={`eco-tier-pill ${getPriorityBadgeClass(deletingAnnouncement.priority)}`}>
                  {deletingAnnouncement.priority || 'Normal'} Priority
                </span>
                <span className={`eco-tier-pill ${getCategoryBadgeClass(deletingAnnouncement.category)}`}>
                  {deletingAnnouncement.category || 'General Update'}
                </span>
                <span className="eco-tier-pill" style={{ backgroundColor: '#f1f5f9', color: '#475569', borderColor: '#cbd5e1' }}>
                  Audience: {deletingAnnouncement.visibility || 'All Audiences'}
                </span>
              </div>

              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                {deletingAnnouncement.title}
              </h4>

              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                {deletingAnnouncement.content || 'No description provided.'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.78rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                <span>Published: {new Date(deletingAnnouncement.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>&bull;</span>
                <span>Author: {deletingAnnouncement.author?.name || 'Dr. K. V. Subba Rao'}</span>
              </div>
            </div>

            {/* Red Warning Banner */}
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div style={{ fontSize: '0.85rem', color: '#991b1b', lineHeight: 1.5 }}>
                <strong>Permanent Removal Warning:</strong> This action cannot be undone. Once deleted, this announcement will be permanently expunged from the database, removed from the public website banner, and retracted from member notifications.
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div
            style={{
              padding: '1.25rem 1.75rem',
              borderTop: '1px solid #f1f5f9',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={() => setDeletingAnnouncement(null)}
              className="eco-cms-btn-secondary"
              disabled={submitting}
              style={{ padding: '0.6rem 1.25rem' }}
            >
              Cancel & Keep Announcement
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={submitting}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.6rem 1.4rem',
                borderRadius: '9px',
                backgroundColor: '#dc2626',
                border: '1px solid #dc2626',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(220, 38, 38, 0.3)',
              }}
            >
              <Trash2 size={16} />
              <span>{submitting ? 'Deleting...' : 'Yes, Delete Announcement'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // FULL PAGE VIEW 2: COMPLETE BULLETIN DETAILS (PERSISTENT SIDEBAR)
  // =========================================================================
  if (viewingAnnouncement) {
    return (
      <div className="ref-members-page">
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setViewingAnnouncement(null)}
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
            <span>Return to Announcements</span>
          </button>

          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Announcements &bull; Full Bulletin Dossier
          </span>
        </div>

        {/* Full-Width Dossier Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* Header Strip */}
          <div
            style={{
              padding: '1.5rem 1.75rem',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span className={`eco-tier-pill ${getPriorityBadgeClass(viewingAnnouncement.priority)}`}>
                  {viewingAnnouncement.priority || 'Normal'} Priority
                </span>
                <span className={`eco-tier-pill ${getCategoryBadgeClass(viewingAnnouncement.category)}`}>
                  {viewingAnnouncement.category || 'General Update'}
                </span>
                <span className="eco-tier-pill" style={{ backgroundColor: '#f1f5f9', color: '#475569', borderColor: '#cbd5e1' }}>
                  Audience: {viewingAnnouncement.visibility || 'All Audiences'}
                </span>
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                {viewingAnnouncement.title}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => {
                  const target = viewingAnnouncement;
                  setViewingAnnouncement(null);
                  openEditModal(target);
                }}
                className="ref-btn-enroll"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  fontSize: '0.84rem',
                }}
              >
                <Edit2 size={15} />
                <span>Edit Bulletin</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = viewingAnnouncement;
                  setViewingAnnouncement(null);
                  openDeleteModal(target);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '9px',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#dc2626',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                }}
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Bulletin Content Section */}
          <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.65rem' }}>
                Bulletin Details & Official Statement
              </h4>
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  fontSize: '0.96rem',
                  lineHeight: 1.7,
                  color: '#1e293b',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {viewingAnnouncement.content}
              </div>
            </div>

            {/* Metadata Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Date Published</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem', display: 'block' }}>
                  {new Date(viewingAnnouncement.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Publishing Officer</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem', display: 'block' }}>
                  {viewingAnnouncement.author?.name || 'Dr. K. V. Subba Rao'}
                </span>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Broadcast Channel</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem', display: 'block' }}>
                  Official Website & Public Bulletin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // FULL PAGE VIEW 3: COMPLETE EDIT BULLETIN (PERSISTENT SIDEBAR)
  // =========================================================================
  if (editingAnnouncement) {
    return (
      <div className="ref-members-page">
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setEditingAnnouncement(null)}
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
            <span>Return to Announcements</span>
          </button>

          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Announcements &bull; Edit Bulletin Circular
          </span>
        </div>

        {/* Full-Width Form Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              padding: '1.5rem 1.75rem',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Edit Announcement
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              Update bulletin circular, audience permissions, and priority classifications.
            </p>
          </div>

          <form onSubmit={handleUpdateAnnouncement}>
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="ref-form-field">
                <label className="ref-form-label">Announcement Title *</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="ref-form-input"
                />
              </div>

              <div className="ref-form-grid-2">
                <div className="ref-form-field">
                  <label className="ref-form-label">Category *</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="ref-form-select"
                  >
                    <option value="General Update">General Update</option>
                    <option value="Cleanliness Alert">Cleanliness Alert</option>
                    <option value="Meeting Circular">Meeting Circular</option>
                    <option value="Event Notice">Event Notice</option>
                    <option value="Press Release">Press Release</option>
                  </select>
                </div>

                <div className="ref-form-field">
                  <label className="ref-form-label">Priority Level *</label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                    className="ref-form-select"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent Alert</option>
                  </select>
                </div>
              </div>

              <div className="ref-form-field">
                <label className="ref-form-label">Target Audience *</label>
                <select
                  value={editFormData.visibility}
                  onChange={(e) => setEditFormData({ ...editFormData, visibility: e.target.value })}
                  className="ref-form-select"
                >
                  <option value="All">All Audiences (Public & Registered Members)</option>
                  <option value="Public">Public Only</option>
                  <option value="Members Only">Members Only</option>
                </select>
              </div>

              <div className="ref-form-field">
                <label className="ref-form-label">Announcement Image (Optional)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, true)}
                      className="ref-form-input"
                      style={{ flex: '1 1 220px', padding: '0.45rem 0.65rem' }}
                    />
                    <input
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={editFormData.imageUrl?.startsWith('data:') ? '' : editFormData.imageUrl || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                      className="ref-form-input"
                      style={{ flex: '1 1 240px' }}
                    />
                  </div>
                  {editFormData.imageUrl && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img
                        src={editFormData.imageUrl}
                        alt="Announcement preview"
                        style={{ width: '120px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <button
                        type="button"
                        onClick={() => setEditFormData({ ...editFormData, imageUrl: '' })}
                        className="eco-cms-btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="ref-form-field">
                <label className="ref-form-label">Announcement Details & Content *</label>
                <textarea
                  rows={6}
                  required
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                  className="ref-form-textarea"
                />
              </div>
            </div>

            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderTop: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                onClick={() => setEditingAnnouncement(null)}
                className="eco-cms-btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="ref-btn-enroll"
                style={{ padding: '0.6rem 1.4rem' }}
              >
                {submitting ? 'Saving Changes...' : 'Save & Publish Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // FULL PAGE VIEW 4: COMPLETE CREATE BULLETIN (PERSISTENT SIDEBAR)
  // =========================================================================
  if (showAddModal) {
    return (
      <div className="ref-members-page">
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
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
            <span>Return to Announcements</span>
          </button>

          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Announcements &bull; Publish New Circular
          </span>
        </div>

        {/* Full-Width Form Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div
            style={{
              padding: '1.5rem 1.75rem',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Publish New Announcement
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              Broadcast cleanliness alerts, river updates, and official guidelines to citizens and members.
            </p>
          </div>

          <form onSubmit={handleCreateAnnouncement}>
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="ref-form-field">
                <label className="ref-form-label">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Single-Use Plastic Ban on River Ghats"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="ref-form-input"
                />
              </div>

              <div className="ref-form-grid-2">
                <div className="ref-form-field">
                  <label className="ref-form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="ref-form-select"
                  >
                    <option value="General Update">General Update</option>
                    <option value="Cleanliness Alert">Cleanliness Alert</option>
                    <option value="Meeting Circular">Meeting Circular</option>
                    <option value="Event Notice">Event Notice</option>
                    <option value="Press Release">Press Release</option>
                  </select>
                </div>

                <div className="ref-form-field">
                  <label className="ref-form-label">Priority Level *</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="ref-form-select"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent Alert</option>
                  </select>
                </div>
              </div>

              <div className="ref-form-field">
                <label className="ref-form-label">Target Audience *</label>
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                  className="ref-form-select"
                >
                  <option value="All">All Audiences (Public & Registered Members)</option>
                  <option value="Public">Public Only</option>
                  <option value="Members Only">Members Only</option>
                </select>
              </div>

              <div className="ref-form-field">
                <label className="ref-form-label">Announcement Image (Optional)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileChange(e, false)}
                      className="ref-form-input"
                      style={{ flex: '1 1 220px', padding: '0.45rem 0.65rem' }}
                    />
                    <input
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={formData.imageUrl?.startsWith('data:') ? '' : formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="ref-form-input"
                      style={{ flex: '1 1 240px' }}
                    />
                  </div>
                  {formData.imageUrl && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img
                        src={formData.imageUrl}
                        alt="Announcement preview"
                        style={{ width: '120px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="eco-cms-btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                      >
                        Remove Image
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="ref-form-field">
                <label className="ref-form-label">Announcement Details & Content *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Provide full description, guidelines, or instructions for this official bulletin..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="ref-form-textarea"
                />
              </div>
            </div>

            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderTop: '1px solid #f1f5f9',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="eco-cms-btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="ref-btn-enroll"
                style={{ padding: '0.6rem 1.4rem' }}
              >
                {submitting ? 'Publishing...' : 'Publish Announcement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="ref-members-page">
      {/* 1. Header Matching Redesigned Design */}
      <div className="ref-members-header">
        <div className="ref-header-left">
          <div className="ref-header-icon-box">
            <Megaphone size={24} />
          </div>
          <div className="ref-header-text">
            <h2>Official Bulletins & Notices</h2>
            <p>Publish river cleanliness alerts, ecological notices, and circulars for citizens and members.</p>
          </div>
        </div>

        <div className="ref-header-actions">
          <button
            onClick={() => setShowAddModal(true)}
            className="ref-btn-enroll"
            title="Publish a new announcement"
          >
            <Plus size={16} />
            <span>New Announcement</span>
          </button>
        </div>
      </div>

      {/* 2. Feedback Alert Banner */}
      {feedback.text && (
        <div className={`ref-alert-banner ${feedback.type === 'error' ? 'ref-alert-error' : ''}`}>
          <div className="ref-alert-left">
            {feedback.type === 'error' ? (
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
            ) : (
              <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback({ type: '', text: '' })}
            className="ref-alert-dismiss"
            title="Dismiss notification"
          >
            Dismiss &times;
          </button>
        </div>
      )}

      {/* 3. 4-Card Pastel KPI Metric Strip */}
      <div className="ref-kpi-grid">
        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-blue">
            <Megaphone size={20} />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-value">{totalCount}</span>
            <span className="ref-kpi-label">Total Bulletins</span>
          </div>
        </div>

        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-orange">
            <AlertTriangle size={20} />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-value">{urgentCount}</span>
            <span className="ref-kpi-label">Urgent Alerts</span>
          </div>
        </div>

        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-green">
            <CheckCircle size={20} />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-value">{updateCount}</span>
            <span className="ref-kpi-label">General Updates</span>
          </div>
        </div>

        <div className="ref-kpi-card">
          <div className="ref-kpi-icon-bubble ref-bubble-purple">
            <Lock size={20} />
          </div>
          <div className="ref-kpi-details">
            <span className="ref-kpi-value">{memberOnlyCount}</span>
            <span className="ref-kpi-label">Members Only</span>
          </div>
        </div>
      </div>

      {/* 4. Filter & Search Bar */}
      <section className="eco-memberships-filter-card">
        <div className="eco-filter-left">
          <div className="eco-search-bar">
            <Search size={16} className="eco-search-icon" />
            <input
              type="text"
              placeholder="Search by title, keyword, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="eco-search-input"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="eco-search-clear-btn"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="eco-filter-right">
          <div className="eco-filter-group">
            <label className="eco-filter-label">Priority:</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="eco-filter-select"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="Important">Important</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          <div className="eco-filter-group">
            <label className="eco-filter-label">Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="eco-filter-select"
            >
              <option value="All">All Categories</option>
              <option value="General Update">General Update</option>
              <option value="Cleanliness Alert">Cleanliness Alert</option>
              <option value="Meeting Circular">Meeting Circular</option>
              <option value="Event Notice">Event Notice</option>
              <option value="Press Release">Press Release</option>
            </select>
          </div>

          <div className="eco-filter-group">
            <label className="eco-filter-label">Audience:</label>
            <select
              value={filterAudience}
              onChange={(e) => setFilterAudience(e.target.value)}
              className="eco-filter-select"
            >
              <option value="All">All Audiences</option>
              <option value="Public">Public Only</option>
              <option value="Members Only">Members Only</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="eco-reset-filters-btn"
              title="Reset all filters"
            >
              <X size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </section>

      {/* 5. Announcements Feed with Full CRUD Operations */}
      {loading ? (
        <div className="ref-table-card p-12 text-center text-muted">
          <Clock size={28} className="animate-spin inline mb-3 text-emerald-700" />
          <p className="font-semibold text-slate-700">Loading bulletins from database...</p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="ref-table-card p-12 text-center text-muted">
          <Megaphone size={36} className="mx-auto mb-3 opacity-40 text-slate-500" />
          <p className="font-semibold text-base text-slate-700 mb-1">
            No bulletins or announcements found.
          </p>
          <span className="text-sm text-slate-500">
            Publish a new announcement or reset your active filters.
          </span>
          <div className="mt-4 flex justify-center gap-2">
            {hasActiveFilters && (
              <button onClick={resetFilters} className="eco-reset-filters-btn">
                Reset Filters
              </button>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="ref-btn-enroll"
            >
              <Plus size={15} /> New Announcement
            </button>
          </div>
        </div>
      ) : (
        <div className="eco-announcements-list">
          {filteredAnnouncements.map((a) => (
            <div key={a._id} className="eco-announcement-card">
              {/* Card Header: Badges & CRUD Actions */}
              <div className="eco-announcement-card-header">
                <div className="eco-announcement-badges">
                  {/* Priority Pill */}
                  <span
                    className={`eco-tier-pill ${getPriorityBadgeClass(a.priority)}`}
                  >
                    {a.priority === 'Urgent' && <AlertTriangle size={12} className="inline mr-1" />}
                    {a.priority}
                  </span>

                  {/* Category Pill */}
                  <span
                    className={`eco-tier-pill ${getCategoryBadgeClass(a.category)}`}
                  >
                    {a.category}
                  </span>

                  {/* Audience Pill */}
                  <span
                    className={`eco-visibility-badge ${
                      a.visibility === 'Members Only'
                        ? 'eco-visibility-members'
                        : 'eco-visibility-public'
                    }`}
                  >
                    {a.visibility === 'Members Only' ? (
                      <>
                        <Lock size={12} />
                        <span>Audience: Members Only</span>
                      </>
                    ) : (
                      <>
                        <Globe size={12} />
                        <span>Audience: {a.visibility || 'All'}</span>
                      </>
                    )}
                  </span>
                </div>

                {/* CRUD Action Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* UPDATE (Edit) */}
                  <button
                    type="button"
                    onClick={() => openEditModal(a)}
                    className="ref-btn-edit-action"
                    title="Edit announcement"
                  >
                    <Edit2 size={11} />
                    <span>Edit</span>
                  </button>

                  {/* DELETE */}
                  <button
                    type="button"
                    onClick={() => openDeleteModal(a)}
                    className="ref-act-btn delete"
                    title="Delete announcement"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Title & Body Content */}
              <h3 className="eco-announcement-title">{a.title}</h3>
              <p className="eco-announcement-body">{a.content}</p>

              {/* Card Footer: Author & Published Date */}
              <div className="eco-announcement-card-footer">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 font-medium text-slate-500">
                    <Calendar size={13} className="text-emerald-700" />
                    Published:{' '}
                    {new Date(a.publishedAt || a.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  {a.createdBy?.name && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <User size={12} />
                      {a.createdBy.name}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">Official Bulletin</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
