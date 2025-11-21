import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { createGalleryItem, deleteGalleryItem, getGallery } from '../utils/api.js';

const emptyForm = {
    title: '',
    alt: '',
    tags: '',
    imageData: ''
};

export default function AdminGallery() {
    const { isAuthenticated, isAdmin, token } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            navigate('/signin', { replace: true });
            return;
        }
        const load = async () => {
            const res = await getGallery();
            if (!res?.error && Array.isArray(res)) {
                const normalized = res.map((item) => ({
                    ...item,
                    id: item._id || item.id,
                    src: item.imageData || item.src,
                    tags: Array.isArray(item.tags) ? item.tags : []
                }));
                setItems(normalized);
            }
        };
        load();
    }, [isAuthenticated, isAdmin, navigate]);

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleFile = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setForm((prev) => ({ ...prev, imageData: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        if (!form.title || !form.alt || !form.imageData) {
            setError('Title, alt, and image are required.');
            return;
        }
        setLoading(true);
        const payload = {
            title: form.title,
            alt: form.alt,
            tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
            imageData: form.imageData
        };
        const res = await createGalleryItem(payload, token);
        if (res?.error) {
            setError(res.error);
            setLoading(false);
            return;
        }
        const newItem = { ...res, id: res._id || res.id, src: res.imageData || res.src, tags: Array.isArray(res.tags) ? res.tags : [] };
        setItems((prev) => [...prev, newItem]);
        setForm(emptyForm);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const res = await deleteGalleryItem(id, token);
        if (!res?.error) {
            setItems((prev) => prev.filter((item) => item.id !== id && item._id !== id));
        }
    };

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
                    Alt text
                    <input type="text" value={form.alt} onChange={handleChange('alt')} required />
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
                <button className="btn contact-form__submit" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Add Image'}
                </button>
            </form>

            <div className="contact-grid__card">
                <h3 style={{ marginTop: 0 }}>Gallery Items</h3>
                {items.length === 0 && <p>No images yet.</p>}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {items.map((item) => {
                        const id = item.id || item._id;
                        return (
                            <div key={id} style={{ border: '1px solid rgba(148,163,184,0.25)', borderRadius: '10px', padding: '10px' }}>
                                <img src={item.src} alt={item.alt} style={{ width: '100%', borderRadius: '8px' }} />
                                <strong>{item.title}</strong>
                                <div style={{ fontSize: '0.9rem', color: 'rgba(226,232,240,0.75)' }}>{item.alt}</div>
                                <div style={{ fontSize: '0.85rem', color: 'rgba(148,163,184,0.9)' }}>{Array.isArray(item.tags) ? item.tags.join(', ') : ''}</div>
                                <button type="button" className="btn btn--ghost" style={{ marginTop: '8px' }} onClick={() => handleDelete(id)}>
                                    Delete
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
