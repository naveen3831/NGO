import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { HeartHandshake, Trash2, AlertTriangle, ArrowLeft } from 'lucide-react';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const res = await API.get('/admin/donations');
        setDonations(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load donations:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDonations();
  }, []);

  const totalAmount = donations.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setFeedback({ type: '', text: '' });
    try {
      await API.delete(`/admin/donations/${deleteTarget._id}`);
      setDonations((prev) => prev.filter((d) => d._id !== deleteTarget._id));
      setFeedback({ type: 'success', text: 'Donation record removed.' });
      setDeleteTarget(null);
    } catch {
      setFeedback({ type: 'error', text: 'Failed to delete donation record.' });
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  if (deleteTarget) {
    return (
      <div className="ref-members-page">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="ref-btn-enroll"
            style={{ backgroundColor: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Donations Ledger</span>
          </button>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Donations &bull; Confirm Removal</span>
        </div>

        <div className="clean-content-box" style={{ border: '1px solid #fecaca' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', marginTop: 0 }}>
            <AlertTriangle size={20} /> Remove Donation Record
          </h3>
          <p style={{ color: '#334155', fontSize: '0.92rem', margin: '0.75rem 0 1.25rem' }}>
            Are you sure you want to delete the donation record from <strong>{deleteTarget.donorName}</strong> (₹{Number(deleteTarget.amount).toLocaleString('en-IN')})?
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setDeleteTarget(null)} className="ref-modal-btn-cancel" disabled={deleting}>
              Cancel
            </button>
            <button type="button" onClick={confirmDelete} className="ref-btn-delete-confirm" disabled={deleting}>
              {deleting ? 'Removing...' : 'Remove Donation'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      {feedback.text && (
        <div className={`ref-alert-banner ${feedback.type === 'error' ? 'ref-alert-error' : ''}`} style={{ marginBottom: '1rem' }}>
          <div className="ref-alert-left"><span>{feedback.text}</span></div>
          <button type="button" onClick={() => setFeedback({ type: '', text: '' })} className="ref-alert-dismiss">Dismiss &times;</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="clean-content-box" style={{ borderLeft: '4px solid #006B3C' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Donations Received</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#064e3b' }}>₹{totalAmount.toLocaleString('en-IN')}</div>
        </div>
        <div className="clean-content-box" style={{ borderLeft: '4px solid #008C4A' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Total Contributions</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#064e3b' }}>{donations.length}</div>
        </div>
      </div>

      <div className="clean-content-box">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#064e3b', marginBottom: '1rem' }}>
          <HeartHandshake size={20} /> Donations Ledger
        </h2>
        {loading ? (
          <p>Loading donations...</p>
        ) : donations.length === 0 ? (
          <p style={{ color: '#64748b' }}>No donations recorded yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#064e3b' }}>
                  <th style={{ padding: '0.65rem' }}>Receipt #</th>
                  <th style={{ padding: '0.65rem' }}>Donor</th>
                  <th style={{ padding: '0.65rem' }}>Amount</th>
                  <th style={{ padding: '0.65rem' }}>Purpose</th>
                  <th style={{ padding: '0.65rem' }}>Method</th>
                  <th style={{ padding: '0.65rem' }}>Date</th>
                  <th style={{ padding: '0.65rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.65rem', fontWeight: 600 }}>{d.receiptNumber || '—'}</td>
                    <td style={{ padding: '0.65rem' }}>
                      <div>{d.donorName}</div>
                      <small style={{ color: '#64748b' }}>{d.email}</small>
                    </td>
                    <td style={{ padding: '0.65rem', fontWeight: 700, color: '#006B3C' }}>₹{Number(d.amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.65rem' }}>{d.purpose}</td>
                    <td style={{ padding: '0.65rem' }}>{d.paymentMethod}</td>
                    <td style={{ padding: '0.65rem' }}>{new Date(d.createdAt).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '0.65rem' }}>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(d)}
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDonations;
