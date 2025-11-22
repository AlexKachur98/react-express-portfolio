import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
    createProject,
    deleteProject,
    deleteAllProjects,
    getProjects,
    updateProject
} from '../utils/api.js';

const emptyForm = {
    title: '',
    description: '',
    tags: '',
    image: '',
    github: '',
    live: ''
};

export default function AdminProjects() {
    const { isAdmin } = useAuth();
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAdmin) return;
        const load = async () => {
            const res = await getProjects();
            if (!res?.error && Array.isArray(res)) {
                setItems(res);
            }
        };
        load();
    }, [isAdmin]);

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const payload = {
            title: form.title,
            description: form.description,
            tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
            image: form.image || undefined,
            github: form.github || undefined,
            live: form.live || undefined,
        };

        const res = editingId
            ? await updateProject(editingId, payload)
            : await createProject(payload);

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
            const refreshed = await getProjects();
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
            tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
            image: item.image || '',
            github: item.github || '',
            live: item.live || ''
        });
    };

    const handleDelete = async (id) => {
        const res = await deleteProject(id);
        if (!res?.error) {
            setItems((prev) => prev.filter((item) => item._id !== id));
        }
    };

    const handleDeleteAll = async () => {
        const confirmed = window.confirm('Delete ALL projects? This cannot be undone.');
        if (!confirmed) return;
        const res = await deleteAllProjects();
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
            <h2 className="section__heading">Manage Projects</h2>

            <form className="contact-form" onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
                <label>
                    Title
                    <input type="text" value={form.title} onChange={handleChange('title')} required />
                </label>
                <label>
                    Description
                    <textarea value={form.description} onChange={handleChange('description')} rows={3} required />
                </label>
                <label>
                    Tags (comma separated)
                    <input type="text" value={form.tags} onChange={handleChange('tags')} />
                </label>
                <div className="contact-form__row">
                    <label>
                        Image URL
                        <input type="text" value={form.image} onChange={handleChange('image')} />
                    </label>
                    <label>
                        GitHub URL
                        <input type="text" value={form.github} onChange={handleChange('github')} />
                    </label>
                </div>
                <label>
                    Live URL
                    <input type="text" value={form.live} onChange={handleChange('live')} />
                </label>
                {error && <p className="contact-form__error">{error}</p>}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button className="btn contact-form__submit" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
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
                <h3 style={{ marginTop: 0 }}>Existing Projects</h3>
                {items.length === 0 && <p>No entries yet.</p>}
                {items.map((item) => (
                    <div key={item._id} style={{ borderBottom: '1px solid rgba(148,163,184,0.2)', padding: '10px 0' }}>
                        <strong>{item.title}</strong>
                        <div style={{ marginTop: '6px', color: 'rgba(226,232,240,0.85)' }}>{item.description}</div>
                        <div style={{ marginTop: '6px', color: 'rgba(148,163,184,0.9)' }}>{Array.isArray(item.tags) ? item.tags.join(', ') : ''}</div>
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
