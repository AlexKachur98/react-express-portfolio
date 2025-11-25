/**
 * @file AdminGuestbook.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Admin tools to review and delete guest book signatures.
 */
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteAllGuestbookEntries, deleteGuestbookEntry, getGuestbookEntries } from '../utils/api.js';
import { formatDate, extractPaginatedData } from '../utils/helpers.js';

export default function AdminGuestbook() {
    const { isAdmin } = useAuth();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAdmin) return;
        const load = async () => {
            const res = await getGuestbookEntries();
            if (res?.error) {
                setError(res.error);
                return;
            }
            const { items: loadedEntries } = extractPaginatedData(res);
            setEntries(loadedEntries);
        };
        load();
    }, [isAdmin]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Delete this guest book entry?');
        if (!confirmed) return;
        const res = await deleteGuestbookEntry(id);
        if (!res?.error) {
            setEntries((prev) => prev.filter((entry) => entry._id !== id));
        } else if (res?.error) {
            setError(res.error);
        }
    };

    const handleDeleteAll = async () => {
        const confirmed = window.confirm('Delete ALL guest book entries? This is only allowed in development.');
        if (!confirmed) return;
        setLoading(true);
        const res = await deleteAllGuestbookEntries();
        if (!res?.error) {
            setEntries([]);
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
            <h2 className="section__heading">Guestbook</h2>
            {error && <p className="contact-form__error">{error}</p>}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                <button type="button" className="btn btn--ghost" onClick={handleDeleteAll} disabled={loading}>
                    Delete all
                </button>
            </div>
            <div className="contact-grid__card">
                {entries.length === 0 && <p>No guest book entries yet.</p>}
                {entries.map((entry) => (
                    <div key={entry._id} style={{ borderBottom: '1px solid rgba(148,163,184,0.2)', padding: '10px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                            <div>
                                <strong>{entry.displayName || 'Guest'}</strong>
                                {entry.user ? <span style={{ marginLeft: '8px', color: 'rgba(148,163,184,0.9)' }}>User: {entry.user}</span> : null}
                            </div>
                            <button type="button" className="btn btn--ghost" onClick={() => handleDelete(entry._id)}>
                                Delete
                            </button>
                        </div>
                        <div style={{ marginTop: '4px', color: 'rgba(226,232,240,0.85)' }}>{entry.message}</div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(148,163,184,0.9)', marginTop: '4px' }}>
                            {formatDate(entry.updatedAt)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
