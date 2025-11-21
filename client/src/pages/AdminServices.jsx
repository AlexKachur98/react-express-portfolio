import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { createService, deleteService, getServices, updateService } from '../utils/api.js';

const emptyForm = {
    title: '',
    description: '',
    icon: '',
    iconLabel: ''
};

export default function AdminServices() {
    const { isAdmin, isAuthenticated, token } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            navigate('/signin', { replace: true });
            return;
        }
        const load = async () => {
            const res = await getServices();
            if (!res?.error && Array.isArray(res)) {
                setItems(res);
            }
        };
        load();
    }, [isAuthenticated, isAdmin, navigate]);

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const payload = { ...form };

        const res = editingId
            ? await updateService(editingId, payload, token)
            : await createService(payload, token);

        if (res?.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        if (editingId) {
            setItems((prev) => prev.map((item) => (item._id === editingId ? res : item)));
        } else if (res?._id) {
            setItems((prev) => [...prev, res]);
        } else {
            const refreshed = await getServices();
            if (!refreshed?.error && Array.isArray(refreshed)) {
                setItems(refreshed);
            }
        }

        setForm(emptyForm);
        setEditingId(null);
        setLoading(false);
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setForm({
            title: item.title || '',
            description: item.description || '',
            icon: item.icon || '',
            iconLabel: item.iconLabel || ''
        });
    };

    const handleDelete = async (id) => {
        const res = await deleteService(id, token);
        if (!res?.error) {
            setItems((prev) => prev.filter((item) => item._id !== id));
        }
    };

    return (
        <div className="section section--glass">
            <div className="section__eyebrow">Admin</div>
            <h2 className="section__heading">Manage Services</h2>

            <form className="contact-form" onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
                <label>
                    Title
                    <input type="text" value={form.title} onChange={handleChange('title')} required />
                </label>
                <label>
                    Description
                    <textarea value={form.description} onChange={handleChange('description')} rows={3} required />
                </label>
                <div className="contact-form__row">
                    <label>
                        Icon URL
                        <input type="text" value={form.icon} onChange={handleChange('icon')} />
                    </label>
                    <label>
                        Icon Label
                        <input type="text" value={form.iconLabel} onChange={handleChange('iconLabel')} />
                    </label>
                </div>
                {error && <p className="contact-form__error">{error}</p>}
                <button className="btn contact-form__submit" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
                </button>
            </form>

            <div className="contact-grid__card">
                <h3 style={{ marginTop: 0 }}>Existing Services</h3>
                {items.length === 0 && <p>No entries yet.</p>}
                {items.map((item) => (
                    <div key={item._id} style={{ borderBottom: '1px solid rgba(148,163,184,0.2)', padding: '10px 0' }}>
                        <strong>{item.title}</strong> — {item.description}
                        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                            <button type="button" className="btn btn--ghost" onClick={() => handleEdit(item)}>Edit</button>
                            <button type="button" className="btn btn--ghost" onClick={() => handleDelete(item._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
