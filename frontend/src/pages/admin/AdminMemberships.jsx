import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Edit2,
  Calendar,
  Check,
  X,
  RefreshCw,
  Award,
  DollarSign,
} from 'lucide-react';

const AdminMemberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editingItem, setEditingItem] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form State for Editing Membership
  const [formData, setFormData] = useState({
    membershipType: 'Annual Member',
    status: 'Active',
    validTo: '',
    feePaid: 0,
    paymentStatus: 'Paid',
    remarks: '',
  });

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/memberships');
      setMemberships(res.data);
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: 'Failed to fetch membership records from database.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      membershipType: item.membershipType || 'Annual Member',
      status: item.status || 'Active',
      validTo: item.validTo ? new Date(item.validTo).toISOString().split('T')[0] : '',
      feePaid: item.feePaid || 0,
      paymentStatus: item.paymentStatus || 'Paid',
      remarks: item.remarks || '',
    });
    setFeedback({ type: '', message: '' });
  };

  const closeEditModal = () => {
    setEditingItem(null);
  };

  const handleSaveMembership = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setSaveLoading(true);
      const res = await api.patch(`/admin/memberships/${editingItem._id}`, formData);
      setMemberships((prev) =>
        prev.map((m) => (m._id === editingItem._id ? res.data : m))
      );
      setFeedback({
        type: 'success',
        message: `Membership for ${editingItem.user?.name || editingItem.membershipNumber} successfully updated in database.`,
      });
      setEditingItem(null);
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to update membership in database.',
      });
    } finally {
      setSaveLoading(false);
    }
  };

  // Filter & Search Logic
  const filtered = memberships.filter((m) => {
    const matchesSearch =
      !search ||
      m.membershipNumber?.toLowerCase().includes(search.toLowerCase()) ||
      m.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.user?.memberId?.toLowerCase().includes(search.toLowerCase()) ||
      m.user?.email?.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === 'All' || m.membershipType === filterType;
    const matchesStatus = filterStatus === 'All' || m.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate dynamic stats
  const totalCount = memberships.length;
  const activeCount = memberships.filter((m) => m.status === 'Active').length;
  const pendingCount = memberships.filter((m) => m.status === 'Pending Approval').length;
  const lifeCount = memberships.filter((m) => m.membershipType === 'Life Member').length;
  const totalFees = memberships.reduce((acc, cur) => acc + (cur.feePaid || 0), 0);

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Membership Management</h1>
          <p className="admin-page-subtitle">
            Oversee membership tiers, validity dates, renewal status, and fee records directly in MongoDB.
          </p>
        </div>
        <button
          onClick={fetchMemberships}
          className="btn btn-outline btn-sm flex items-center gap-1"
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Database</span>
        </button>
      </div>

      {feedback.message && (
        <div className={`alert-banner alert-${feedback.type} mb-4`}>
          {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback({ type: '', message: '' })}
            className="ml-auto text-xs opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="admin-stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-icon-wrap bg-blue-tint">
            <CreditCard size={22} className="text-primary" />
          </div>
          <div>
            <span className="stat-label">Total Memberships</span>
            <h3 className="stat-value">{totalCount}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap bg-green-tint">
            <CheckCircle size={22} className="text-green-600" />
          </div>
          <div>
            <span className="stat-label">Active Members</span>
            <h3 className="stat-value">{activeCount}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap bg-amber-tint">
            <Clock size={22} className="text-amber-600" />
          </div>
          <div>
            <span className="stat-label">Pending Approval</span>
            <h3 className="stat-value">{pendingCount}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap bg-purple-tint">
            <Award size={22} className="text-purple-600" />
          </div>
          <div>
            <span className="stat-label">Life Members</span>
            <h3 className="stat-value">{lifeCount}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap bg-teal-tint">
            <DollarSign size={22} className="text-teal-600" />
          </div>
          <div>
            <span className="stat-label">Fees Collected</span>
            <h3 className="stat-value">₹{totalFees.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="admin-table-filters mb-4">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Member Name, ID, or Membership No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="clear-search">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-select-group">
          <label className="filter-label">
            <Filter size={14} /> Tier:
          </label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All Tiers</option>
            <option value="Life Member">Life Member</option>
            <option value="Annual Member">Annual Member</option>
            <option value="Volunteer Member">Volunteer Member</option>
            <option value="Patron">Patron</option>
            <option value="Student Member">Student Member</option>
          </select>
        </div>

        <div className="filter-select-group">
          <label className="filter-label">Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Expired">Expired</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Memberships Data Table */}
      <div className="admin-card">
        {loading ? (
          <div className="p-8 text-center text-muted">
            <RefreshCw size={24} className="animate-spin inline mb-2" />
            <p>Loading membership records from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <CreditCard size={32} className="mx-auto mb-2 opacity-50" />
            <p className="font-semibold">No membership records matched your filters.</p>
            <span className="text-sm">Try adjusting your search criteria or resetting filters.</span>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Membership No</th>
                  <th>Member Name</th>
                  <th>Member ID</th>
                  <th>Tier / Type</th>
                  <th>Status</th>
                  <th>Valid Until</th>
                  <th>Fee Paid</th>
                  <th>Payment</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <span className="font-mono font-semibold text-primary">
                        {item.membershipNumber}
                      </span>
                    </td>
                    <td>
                      <div>
                        <span className="font-semibold block">{item.user?.name || 'Unknown'}</span>
                        <span className="text-xs text-muted">{item.user?.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-subtle">{item.user?.memberId || 'N/A'}</span>
                    </td>
                    <td>
                      <span className="membership-tier-badge">{item.membershipType}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          item.status === 'Active'
                            ? 'badge-success'
                            : item.status === 'Pending Approval'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm">
                        {item.validTo
                          ? new Date(item.validTo).toLocaleDateString()
                          : 'Lifetime'}
                      </span>
                    </td>
                    <td>
                      <span className="font-semibold">₹{item.feePaid || 0}</span>
                    </td>
                    <td>
                      <span
                        className={`text-xs font-semibold ${
                          item.paymentStatus === 'Paid'
                            ? 'text-green-600'
                            : item.paymentStatus === 'Pending'
                            ? 'text-amber-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => openEditModal(item)}
                        className="btn btn-outline btn-xs inline-flex items-center gap-1"
                        title="Edit Membership"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Membership Modal */}
      {editingItem && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">
                Edit Membership: {editingItem.membershipNumber}
              </h3>
              <button onClick={closeEditModal} className="btn-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMembership}>
              <div className="modal-body">
                <div className="mb-3 p-3 bg-gray-50 rounded text-sm">
                  <p>
                    <strong>Member:</strong> {editingItem.user?.name} (ID: {editingItem.user?.memberId})
                  </p>
                  <p>
                    <strong>Email:</strong> {editingItem.user?.email} | <strong>Phone:</strong>{' '}
                    {editingItem.user?.phone || 'N/A'}
                  </p>
                </div>

                <div className="form-group mb-3">
                  <label>Membership Tier *</label>
                  <select
                    value={formData.membershipType}
                    onChange={(e) =>
                      setFormData({ ...formData, membershipType: e.target.value })
                    }
                    className="form-control"
                    required
                  >
                    <option value="Life Member">Life Member</option>
                    <option value="Annual Member">Annual Member</option>
                    <option value="Volunteer Member">Volunteer Member</option>
                    <option value="Patron">Patron</option>
                    <option value="Student Member">Student Member</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label>Membership Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-control"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Expired">Expired</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div className="grid-2 gap-3 mb-3">
                  <div className="form-group">
                    <label>Valid Until</label>
                    <input
                      type="date"
                      value={formData.validTo}
                      onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                      className="form-control"
                    />
                    <small className="text-muted">Leave empty for Life / Lifetime membership</small>
                  </div>

                  <div className="form-group">
                    <label>Fee Paid (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.feePaid}
                      onChange={(e) =>
                        setFormData({ ...formData, feePaid: Number(e.target.value) })
                      }
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label>Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentStatus: e.target.value })
                    }
                    className="form-control"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Waived">Waived</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>

                <div className="form-group mb-3">
                  <label>Admin Remarks / Notes</label>
                  <textarea
                    rows={2}
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Life membership approved by executive committee on 2026-03-01."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="btn btn-outline"
                  disabled={saveLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Saving to Database...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMemberships;

