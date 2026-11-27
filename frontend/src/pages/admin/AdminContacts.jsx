import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Mail, Trash2, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadMessages = async () => {
    try {
      const res = await API.get('/admin/contacts');
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const markResolved = async (id) => {
    setFeedback({ type: '', text: '' });
    try {
      const res = await API.patch(`/admin/contacts/${id}`, { status: 'Resolved' });
      setMessages((prev) => prev.map((m) => (m._id === id ? res.data : m)));
      setFeedback({ type: 'success', text: 'Inquiry marked as resolved.' });
    } catch {
      setFeedback({ type: 'error', text: 'Failed to update inquiry status.' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setFeedback({ type: '', text: '' });
    try {
      await API.delete(`/admin/contacts/${deleteTarget._id}`);
      setMessages((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      setFeedback({ type: 'success', text: 'Contact inquiry deleted.' });
      setDeleteTarget(null);
    } catch {
      setFeedback({ type: 'error', text: 'Failed to delete message.' });
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
            <span>Back to Contact Inquiries</span>
          </button>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Contact Messages &bull; Confirm Delete</span>
        </div>

        <div className="clean-content-box" style={{ border: '1px solid #fecaca' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', marginTop: 0 }}>
            <AlertTriangle size={20} /> Delete Contact Inquiry
          </h3>
          <p style={{ color: '#334155', fontSize: '0.92rem', margin: '0.75rem 0 1.25rem' }}>
            Are you sure you want to delete the inquiry <strong>{deleteTarget.subject}</strong> from <strong>{deleteTarget.name}</strong>?
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setDeleteTarget(null)} className="ref-modal-btn-cancel" disabled={deleting}>
              Cancel
            </button>
            <button type="button" onClick={confirmDelete} className="ref-btn-delete-confirm" disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete Inquiry'}
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

      <div className="clean-content-box">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#064e3b', marginBottom: '1rem' }}>
          <Mail size={20} /> Contact Inquiries ({messages.length})
        </h2>
        {loading ? (
          <p>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p style={{ color: '#64748b' }}>No contact messages submitted yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg) => (
              <div
                key={msg._id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderLeft: `4px solid ${msg.status === 'Resolved' ? '#10b981' : '#f59e0b'}`,
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                  background: '#fff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <strong style={{ color: '#064e3b', fontSize: '1rem' }}>{msg.subject}</strong>
                    <div style={{ fontSize: '0.84rem', color: '#475569' }}>
                      From: <strong>{msg.name}</strong> ({msg.email} {msg.phone ? `• ${msg.phone}` : ''})
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px', background: msg.status === 'Resolved' ? '#dcfce7' : '#fef3c7', color: msg.status === 'Resolved' ? '#064e3b' : '#92400e', alignSelf: 'start' }}>
                    {msg.status}
                  </span>
                </div>
                <p style={{ margin: '0.75rem 0', color: '#334155', lineHeight: 1.6 }}>{msg.message}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {msg.status !== 'Resolved' && (
                    <button
                      type="button"
                      onClick={() => markResolved(msg._id)}
                      style={{ background: '#dcfce7', color: '#064e3b', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      <CheckCircle size={13} /> Mark Resolved
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(msg)}
                    style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '0.35rem 0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
