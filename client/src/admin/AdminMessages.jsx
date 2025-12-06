/**
 * @file AdminMessages.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Admin dashboard panel for reading and purging contact form submissions.
 */

// React
import { useEffect, useState } from 'react';

// Context
import { useAuth } from '../context/AuthContext.jsx';

// Utils
import { deleteAllContacts, deleteContact, getContacts } from '../utils/api.js';
import { formatDate, extractPaginatedData } from '../utils/helpers.js';
import { getId } from '../utils/getId.js';

export default function AdminMessages() {
    const { isAdmin } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAdmin) return;
        const load = async () => {
            const res = await getContacts();
            if (res?.error) {
                setError(res.error);
                return;
            }
            const { items: loadedItems } = extractPaginatedData(res);
            setItems(loadedItems);
        };
        load();
    }, [isAdmin]);

    const handleDelete = async (id) => {
        const res = await deleteContact(id);
        if (!res?.error) {
            setItems((prev) => prev.filter((item) => getId(item) !== id));
        }
    };

    const handleDeleteAll = async () => {
        const confirmed = window.confirm('Delete ALL messages? This cannot be undone.');
        if (!confirmed) return;
        setLoading(true);
        const res = await deleteAllContacts();
        if (!res?.error) {
            setItems([]);
        } else if (res?.error) {
            setError(res.error);
        }
        setLoading(false);
    };

    if (!isAdmin) {
        return <p className="section section--glass">Admin access required.</p>;
    }

    return (
        <div className="section section--glass">
            <div className="section__eyebrow">Admin</div>
            <h2 className="section__heading">Messages</h2>
            {error && <p className="contact-form__error">{error}</p>}
            <div
                style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}
            >
                <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={handleDeleteAll}
                    disabled={loading}
                >
                    Delete all
                </button>
            </div>
            <div className="contact-grid__card">
                {items.length === 0 && <p>No messages yet.</p>}
                {items.map((msg) => (
                    <div
                        key={getId(msg)}
                        style={{
                            borderBottom: '1px solid rgba(148,163,184,0.2)',
                            padding: '10px 0'
                        }}
                    >
                        <strong>
                            {msg.firstName} {msg.lastName}
                        </strong>{' '}
                        — {msg.email}
                        <div style={{ marginTop: '4px', color: 'rgba(226,232,240,0.85)' }}>
                            {msg.message}
                        </div>
                        <div
                            style={{
                                fontSize: '0.85rem',
                                color: 'rgba(148,163,184,0.9)',
                                marginTop: '4px'
                            }}
                        >
                            {formatDate(msg.createdAt)}
                        </div>
                        <button
                            type="button"
                            className="btn btn--ghost"
                            style={{ marginTop: '6px' }}
                            onClick={() => handleDelete(getId(msg))}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
