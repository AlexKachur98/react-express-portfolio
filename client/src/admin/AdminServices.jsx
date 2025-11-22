/**
 * @file AdminServices.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Admin control panel for creating and maintaining service offerings.
 */
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
    createService,
    deleteService,
    deleteAllServices,
    getServices,
    updateService
} from '../utils/api.js';

const emptyForm = {
    title: '',
    description: '',
    highlight: false
};

export default function AdminServices() {
    const { isAdmin } = useAuth();
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAdmin) return;
        const load = async () => {
            const res = await getServices();
            if (!res?.error && Array.isArray(res)) {
                setItems(res);
            }
        };
        load();
    }, [isAdmin]);

    const handleChange = (field) => (event) => {
        const value = field === 'highlight' ? event.target.checked : event.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const payload = { ...form };
        const res = editingId
            ? await updateService(editingId, payload)
            : await createService(payload);

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
            highlight: Boolean(item.highlight)
        });
    };

    const handleDelete = async (id) => {
        const res = await deleteService(id);
        if (!res?.error) {
            setItems((prev) => prev.filter((item) => item._id !== id));
        }
    };

    const handleDeleteAll = async () => {
        const confirmed = window.confirm('Delete ALL services? This cannot be undone.');
        if (!confirmed) return;
        const res = await deleteAllServices();
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={form.highlight}
                        onChange={handleChange('highlight')}
                    />
                    Highlight
                </label>
                {error && <p className="contact-form__error">{error}</p>}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button className="btn contact-form__submit" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
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
                <h3 style={{ marginTop: 0 }}>Existing Services</h3>
                {items.length === 0 && <p>No entries yet.</p>}
                {items.map((item) => (
                    <div key={item._id} style={{ borderBottom: '1px solid rgba(148,163,184,0.2)', padding: '10px 0' }}>
                        <strong>{item.title}</strong> {item.highlight && <span style={{ color: '#38bdf8' }}>(Highlight)</span>}
                        <div style={{ marginTop: '6px', color: 'rgba(226,232,240,0.85)' }}>{item.description}</div>
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
