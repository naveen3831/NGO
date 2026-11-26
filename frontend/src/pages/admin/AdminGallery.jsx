import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Image as ImageIcon, Plus, Trash2, MapPin } from 'lucide-react';

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) return;
    setSubmitting(true);
    try {
      await API.post('/admin/gallery', form);
      setForm({ title: '', category: 'River Cleaning', location: 'Godavari Riverfront, Rajahmundry', imageUrl: '' });
      await loadGallery();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo from the gallery?')) return;
    try {
      await API.delete(`/admin/gallery/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert('Failed to delete photo');
    }
  };

  return (
    <div style={{ padding: '1.5rem' }}>
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
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ padding: '0.45rem' }} />
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? 'Uploading...' : 'Publish Photo'}
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
                    onClick={() => handleDelete(item._id)}
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

