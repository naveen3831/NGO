import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Users,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  X,
  CreditCard,
} from 'lucide-react';

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'member',
    designation: 'General Member',
    membershipType: 'Annual Member',
    bloodGroup: 'B+',
    street: '',
    city: 'Rajahmundry',
  });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (keyword) params.keyword = keyword;
      if (statusFilter) params.status = statusFilter;

      const { data } = await API.get('/admin/members', { params });
      setMembers(data.members || []);
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to load member records' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMembers();
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      await API.post('/admin/members', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        designation: formData.designation,
        membershipType: formData.membershipType,
        bloodGroup: formData.bloodGroup,
        address: { street: formData.street, city: formData.city },
      });

      setFeedback({ type: 'success', text: `Member "${formData.name}" successfully enrolled!` });
      setShowAddModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'member',
        designation: 'General Member',
        membershipType: 'Annual Member',
        bloodGroup: 'B+',
        street: '',
        city: 'Rajahmundry',
      });
      fetchMembers();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to create member record',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await API.patch(`/admin/members/${userId}/membership`, { status: nextStatus });
      setFeedback({ type: 'success', text: `Membership status updated to ${nextStatus}` });
      fetchMembers();
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to update membership status' });
    }
  };

  const handleDeleteMember = async (userId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove member record for "${memberName}"?`)) {
      return;
    }
    try {
      await API.delete(`/admin/members/${userId}`);
      setFeedback({ type: 'success', text: `Member "${memberName}" removed` });
      fetchMembers();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to remove member record',
      });
    }
  };

  return (
    <div className="admin-members-page">
      {/* Header bar */}
      <div className="admin-page-header">
        <div>
          <h2>Member & Membership Records</h2>
          <p>Maintain membership profiles, registration IDs, and validity statuses.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={16} /> Enroll New Member
        </button>
      </div>

      {feedback.text && (
        <div className={`alert-banner ${feedback.type === 'error' ? 'alert-danger' : 'alert-success'}`}>
          {feedback.text}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <form onSubmit={handleSearchSubmit} className="search-box-form">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or Member ID..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-sm btn-outline">
            Search
          </button>
        </form>

        <div className="filter-selects">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Suspended">Suspended</option>
            <option value="Expired">Expired</option>
          </select>
          <button onClick={fetchMembers} className="btn btn-icon btn-sm" title="Refresh">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Members Data Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member Details</th>
                <th>Member ID</th>
                <th>Contact</th>
                <th>Membership Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading records from database...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No members found matching your search.
                  </td>
                </tr>
              ) : (
                members.map((m) => {
                  const status = m.membership?.status || 'Active';
                  return (
                    <tr key={m._id}>
                      <td>
                        <div className="member-info-col">
                          <strong className="member-name">{m.name}</strong>
                          <span className="member-designation">{m.designation || 'Member'}</span>
                        </div>
                      </td>
                      <td>
                        <code className="member-id-tag">{m.memberId || 'N/A'}</code>
                      </td>
                      <td>
                        <div className="contact-col">
                          <span>{m.email}</span>
                          <small className="text-muted">{m.phone}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline">
                          <CreditCard size={12} /> {m.membership?.membershipType || 'Annual'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${status.toLowerCase()}`}>
                          {status === 'Active' ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-group">
                          <button
                            onClick={() => handleStatusToggle(m._id, status)}
                            className="btn btn-xs btn-outline"
                            title={status === 'Active' ? 'Suspend' : 'Activate'}
                          >
                            {status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                          {m.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteMember(m._id, m.name)}
                              className="btn btn-xs btn-icon btn-danger"
                              title="Delete Member"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Enroll New Member</h3>
              <button onClick={() => setShowAddModal(false)} className="btn-close">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="modal-body">
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sri / Smt. Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98480 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="member@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Membership Category</label>
                  <select
                    value={formData.membershipType}
                    onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                  >
                    <option value="Annual Member">Annual Member (₹500/yr)</option>
                    <option value="Life Member">Life Member (₹5,000)</option>
                    <option value="Volunteer Member">Volunteer Member</option>
                    <option value="Student Member">Student Member</option>
                    <option value="Patron">Patron</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Designation / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Ghat Volunteer / Committee Member"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>City / Location</label>
                <input
                  type="text"
                  placeholder="Rajahmundry / Kovvur / Godavari region"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Creating...' : 'Enroll Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMembers;

