import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { HeartHandshake, Trash2 } from 'lucide-react';

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this donation record?')) return;
    try {
      await API.delete(`/admin/donations/${id}`);
      setDonations((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      alert('Failed to delete donation');
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
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
                        onClick={() => handleDelete(d._id)}
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

