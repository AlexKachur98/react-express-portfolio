import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
    createQualification,
    deleteQualification,
    deleteAllQualifications,
    getQualifications,
    updateQualification
} from '../utils/api.js';

const emptyForm = {
    program: '',
    school: '',
    period: '',
    location: '',
    detailsText: ''
};

export default function AdminEducation() {
    const { isAdmin } = useAuth();
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAdmin) return;
        const load = async () => {
            const res = await getQualifications();
            if (!res?.error && Array.isArray(res)) {
                setItems(res);
            }
        };
        load();
    }, [isAdmin]);

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const buildPayload = () => {
        const details = form.detailsText
            ? form.detailsText.split('\n').map((line) => line.trim()).filter(Boolean)
            : [];
        return {
            program: form.program,
            school: form.school,
            period: form.period,
            location: form.location,
            details
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const payload = buildPayload();
        const res = editingId
            ? await updateQualification(editingId, payload)
            : await createQualification(payload);

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
            program: item.program || '',
            school: item.school || '',
            period: item.period || '',
            location: item.location || '',
            detailsText: Array.isArray(item.details) ? item.details.join('\n') : ''
        });
    };

    const handleDelete = async (id) => {
        const res = await deleteQualification(id);
        if (!res?.error) {
            setItems((prev) => prev.filter((item) => item._id !== id));
        }
    };

    const handleDeleteAll = async () => {
        const confirmed = window.confirm('Delete ALL qualifications? This cannot be undone.');
        if (!confirmed) return;
        const res = await deleteAllQualifications();
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
            <h2 className="section__heading">Manage Education / Qualifications</h2>

            <form className="contact-form" onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
                <div className="contact-form__row">
                    <label>
                        Program
                        <input type="text" value={form.program} onChange={handleChange('program')} required />
                    </label>
                    <label>
                        School
                        <input type="text" value={form.school} onChange={handleChange('school')} required />
                    </label>
                </div>
                <div className="contact-form__row">
                    <label>
                        Period
                        <input type="text" value={form.period} onChange={handleChange('period')} required />
                    </label>
                    <label>
                        Location
                        <input type="text" value={form.location} onChange={handleChange('location')} required />
                    </label>
                </div>
                <label>
                    Details (one per line)
                    <textarea value={form.detailsText} onChange={handleChange('detailsText')} rows={5} />
                </label>
                {error && <p className="contact-form__error">{error}</p>}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button className="btn contact-form__submit" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : editingId ? 'Update Education' : 'Create Education'}
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
                <h3 style={{ marginTop: 0 }}>Existing Qualifications</h3>
                {items.length === 0 && <p>No entries yet.</p>}
                {items.map((item) => (
                    <div key={item._id} style={{ borderBottom: '1px solid rgba(148,163,184,0.2)', padding: '10px 0' }}>
                        <strong>{item.program}</strong> — {item.school} • {item.period} • {item.location}
                        {Array.isArray(item.details) && item.details.length > 0 && (
                            <ul style={{ marginTop: '6px', marginBottom: 0, paddingLeft: '18px' }}>
                                {item.details.map((d, idx) => <li key={idx}>{d}</li>)}
                            </ul>
                        )}
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
