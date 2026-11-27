import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { uploadImageToCloud } from '../../utils/imageUtils';
import { Image as ImageIcon, Plus, Trash2, MapPin, AlertTriangle, ArrowLeft } from 'lucide-react';

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({
    title: '',
    category: 'River Cleaning',
    location: 'Godavari Riverfront, Rajahmundry',
    imageUrl: '',
  });

  const loadGallery = async () => {
    try {
      const res = await API.get('/admin/gallery');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingImage(true);
    setFeedback({ type: '', text: '' });
    try {
      const uploaded = await uploadImageToCloud(file, 'gallery', '/admin/upload');
      setForm((prev) => ({ ...prev, imageUrl: uploaded.url }));
      setFeedback({ type: 'success', text: 'Photo uploaded to Cloudinary! Click Publish Photo to save to MongoDB.' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || err.message || 'Failed to upload image to Cloudinary.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) return;
    setSubmitting(true);
    setFeedback({ type: '', text: '' });
    try {
      await API.post('/admin/gallery', form);
      setForm({ title: '', category: 'River Cleaning', location: 'Godavari Riverfront, Rajahmundry', imageUrl: '' });
      setFeedback({ type: 'success', text: 'Gallery photo published successfully!' });
      await loadGallery();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to upload photo.' });
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    setFeedback({ type: '', text: '' });
    try {
      await API.delete(`/admin/gallery/${deleteTarget._id}`);
      setItems((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setFeedback({ type: 'success', text: `Photo "${deleteTarget.title}" removed from gallery.` });
      setDeleteTarget(null);
    } catch {
      setFeedback({ type: 'error', text: 'Failed to delete photo.' });
      setDeleteTarget(null);
    } finally {
      setSubmitting(false);
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
            <span>Back to Gallery</span>
          </button>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Gallery &bull; Confirm Removal</span>
        </div>

        <div className="clean-content-box" style={{ border: '1px solid #fecaca' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', marginTop: 0 }}>
            <AlertTriangle size={20} /> Remove Gallery Photo
          </h3>
          <p style={{ color: '#334155', fontSize: '0.92rem', margin: '0.75rem 0 1.25rem' }}>
            Are you sure you want to delete <strong>{deleteTarget.title}</strong> from the NGO gallery?
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setDeleteTarget(null)} className="ref-modal-btn-cancel" disabled={submitting}>
              Cancel
            </button>
            <button type="button" onClick={confirmDelete} className="ref-btn-delete-confirm" disabled={submitting}>
              {submitting ? 'Deleting...' : 'Delete Photo'}
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

      <div className="clean-content-box" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#064e3b', marginBottom: '1rem' }}>
          <Plus size={20} /> Add Gallery Photo
        </h2>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <input
            type="text"
            required
            placeholder="Photo Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          >
            <option value="River Cleaning">River Cleaning</option>
            <option value="Plantation">Plantation</option>
            <option value="Awareness">Awareness</option>
            <option value="Events">Events</option>
          </select>
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
          <input
            type="url"
            placeholder="Image URL (or upload file below)"
            value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
          <input type="file" accept="image/*" disabled={uploadingImage} onChange={handleFileChange} style={{ padding: '0.45rem' }} />
          <button type="submit" disabled={submitting || uploadingImage} className="btn btn-primary">
            {uploadingImage ? 'Uploading Image...' : submitting ? 'Saving...' : 'Publish Photo'}
          </button>
        </form>
      </div>

      <div className="clean-content-box">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#064e3b', marginBottom: '1rem' }}>
          <ImageIcon size={18} /> Uploaded Gallery Photos ({items.length})
        </h3>
        {loading ? (
          <p>Loading gallery...</p>
        ) : items.length === 0 ? (
          <p style={{ color: '#64748b' }}>No custom photos uploaded yet. Public gallery shows the default curated photos plus any photos you add here.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem' }}>
            {items.map((item) => (
              <div key={item._id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
                <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                <div style={{ padding: '0.85rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#006B3C', background: '#E8F5E9', padding: '2px 8px', borderRadius: '999px' }}>
                    {item.category}
                  </span>
                  <h4 style={{ margin: '0.5rem 0 0.25rem', fontSize: '0.95rem' }}>{item.title}</h4>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {item.location}
                  </p>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', padding: '0.35rem 0.7rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
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

export default AdminGallery;
