import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
    createGalleryItem,
    deleteGalleryItem,
    deleteAllGalleryItems,
    getGalleryItems,
    updateGalleryItem
} from '../utils/api.js';

const emptyForm = {
    title: '',
    tags: '',
    imageData: ''
};

export default function AdminGallery() {
    const { isAdmin } = useAuth();
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAdmin) return;
        const load = async () => {
            const res = await getGalleryItems();
            if (!res?.error && Array.isArray(res)) {
                const normalized = res.map((item) => ({
                    ...item,
                    id: item._id || item.id,
                    tags: Array.isArray(item.tags) ? item.tags : []
                }));
                setItems(normalized);
            }
        };
        load();
    }, [isAdmin]);

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleFile = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setForm((prev) => ({ ...prev, imageData: reader.result }));
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        if (!form.title || !form.imageData) {
            setError('Title and image are required.');
            return;
        }
        setLoading(true);

        const payload = {
            title: form.title,
            tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
            imageData: form.imageData
        };

        const res = editingId
            ? await updateGalleryItem(editingId, payload)
            : await createGalleryItem(payload);

        if (res?.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        const normalized = { ...res, id: res._id || res.id, tags: Array.isArray(res.tags) ? res.tags : [] };
        if (editingId) {
            setItems((prev) => prev.map((item) => (item._id === editingId || item.id === editingId ? normalized : item)));
        } else {
            setItems((prev) => [...prev, normalized]);
        }

        setForm(emptyForm);
        setEditingId(null);
        setLoading(false);
    };

    const handleEdit = (item) => {
        const id = item._id || item.id;
        setEditingId(id);
        setForm({
            title: item.title || '',
            tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
            imageData: item.imageData || ''
        });
    };

    const handleDelete = async (id) => {
        const res = await deleteGalleryItem(id);
        if (!res?.error) {
            setItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
        }
    };

    const handleDeleteAll = async () => {
        const confirmed = window.confirm('Delete ALL gallery items? This cannot be undone.');
        if (!confirmed) return;
        const res = await deleteAllGalleryItems();
        if (!res?.error) {
            setItems([]);
        }
    };

    if (!isAdmin) {
        return <p className="section section--glass">Admin access required.</p>;
    }

    return (
        <div className="section section--glass">
            <div className="section__eyebrow">Admin</div>
            <h2 className="section__heading">Manage Gallery</h2>

            <form className="contact-form" onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
                <label>
                    Title
                    <input type="text" value={form.title} onChange={handleChange('title')} required />
                </label>
                <label>
                    Tags (comma separated)
                    <input type="text" value={form.tags} onChange={handleChange('tags')} />
                </label>
                <label>
                    Image
                    <input type="file" accept="image/*" onChange={handleFile} />
                </label>
                {form.imageData && (
                    <div style={{ marginBottom: '12px' }}>
                        <img src={form.imageData} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                    </div>
                )}
                {error && <p className="contact-form__error">{error}</p>}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button className="btn contact-form__submit" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : editingId ? 'Update Image' : 'Add Image'}
                    </button>
                    <button type="button" className="btn btn--ghost" onClick={() => { setForm(emptyForm); setEditingId(null); }}>
                        Clear
                    </button>
                    <button type="button" className="btn btn--ghost" onClick={handleDeleteAll}>
                        Delete all
                    </button>
                </div>
            </form>

            <div className="contact-grid__card">
                <h3 style={{ marginTop: 0 }}>Gallery Items</h3>
                {items.length === 0 && <p>No images yet.</p>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    {items.map((item) => {
                        const id = item._id || item.id;
                        return (
                            <div key={id} style={{ border: '1px solid rgba(148,163,184,0.25)', borderRadius: '10px', padding: '10px' }}>
                                {item.imageData && (
                                    <img src={item.imageData} alt={item.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }} />
                                )}
                                <strong>{item.title}</strong>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(148,163,184,0.9)' }}>{Array.isArray(item.tags) ? item.tags.join(', ') : ''}</div>
                                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                    <button type="button" className="btn btn--ghost" onClick={() => handleEdit(item)}>Edit</button>
                                    <button type="button" className="btn btn--ghost" onClick={() => handleDelete(id)}>Delete</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
