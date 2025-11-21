import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { createQualification, deleteQualification, getQualifications, updateQualification } from '../utils/api.js';

const emptyForm = {
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    completion: '',
    description: ''
};

export default function AdminEducation() {
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
            const res = await getQualifications();
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
            ? await updateQualification(editingId, payload, token)
            : await createQualification(payload, token);

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
            // Fallback refetch if response lacks full data
            const refreshed = await getQualifications();
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
            firstName: item.firstName || '',
            lastName: item.lastName || '',
            email: item.email || '',
            completion: item.completion ? item.completion.substring(0, 10) : '',
            description: item.description || ''
        });
    };

    const handleDelete = async (id) => {
        const res = await deleteQualification(id, token);
        if (!res?.error) {
            setItems((prev) => prev.filter((item) => item._id !== id));
        }
    };

    return (
        <div className="section section--glass">
            <div className="section__eyebrow">Admin</div>
            <h2 className="section__heading">Manage Education / Qualifications</h2>

            <form className="contact-form" onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
                <div className="contact-form__row">
                    <label>
                        Title
                        <input type="text" value={form.title} onChange={handleChange('title')} required />
                    </label>
                    <label>
                        Completion Date
                        <input type="date" value={form.completion} onChange={handleChange('completion')} required />
                    </label>
                </div>
                <div className="contact-form__row">
                    <label>
                        First Name
                        <input type="text" value={form.firstName} onChange={handleChange('firstName')} required />
                    </label>
                    <label>
                        Last Name
                        <input type="text" value={form.lastName} onChange={handleChange('lastName')} required />
                    </label>
                    <label>
                        Email
                        <input type="email" value={form.email} onChange={handleChange('email')} required />
                    </label>
                </div>
                <label>
                    Description
                    <textarea value={form.description} onChange={handleChange('description')} rows={3} required />
                </label>
                {error && <p className="contact-form__error">{error}</p>}
                <button className="btn contact-form__submit" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : editingId ? 'Update Qualification' : 'Create Qualification'}
                </button>
            </form>

            <div className="contact-grid__card">
                <h3 style={{ marginTop: 0 }}>Existing Qualifications</h3>
                {items.length === 0 && <p>No entries yet.</p>}
                {items.map((item) => (
                    <div key={item._id} style={{ borderBottom: '1px solid rgba(148,163,184,0.2)', padding: '10px 0' }}>
                        <strong>{item.title}</strong> — {item.firstName} {item.lastName} ({item.email}) · {item.completion?.substring(0,10)}
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
