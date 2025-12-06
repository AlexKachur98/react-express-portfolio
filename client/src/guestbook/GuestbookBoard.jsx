/**
 * @file GuestbookBoard.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Displays the guest book feed and lets the signed-in user create/update their note.
 */

// React
import { useEffect, useMemo, useState } from 'react';

// Context
import { useAuth } from '../context/AuthContext.jsx';

// Utils
import { deleteMyGuestbookEntry, getGuestbookEntries, signGuestbook } from '../utils/api.js';
import { formatDate, extractPaginatedData } from '../utils/helpers.js';

const sortEntries = (items = []) => {
    return [...items].sort((a, b) => {
        const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return bTime - aTime;
    });
};

export default function GuestbookBoard() {
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [displayName, setDisplayName] = useState(user?.name || '');
    const [message, setMessage] = useState('');

    const myEntry = useMemo(() => {
        // Keep track of the entry that belongs to the current user so we can show context and prefill
        const userId = user?._id?.toString();
        return entries.find((entry) => {
            const entryUser = typeof entry.user === 'object' ? entry.user?._id : entry.user;
            return entryUser && entryUser.toString() === userId;
        });
    }, [entries, user]);

    useEffect(() => {
        if (user?.name) {
            setDisplayName(user.name);
        }
    }, [user]);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            setLoading(true);
            const res = await getGuestbookEntries();
            if (!isMounted) return;

            if (res?.error) {
                setError(res.error);
            } else {
                const { items: loadedEntries } = extractPaginatedData(res);
                const sorted = sortEntries(loadedEntries);
                setEntries(sorted);
                const mine = sorted.find((entry) => {
                    const entryUser = typeof entry.user === 'object' ? entry.user?._id : entry.user;
                    return entryUser && user?._id && entryUser.toString() === user._id.toString();
                });
                if (mine?.message) {
                    setMessage(mine.message);
                }
            }
            setLoading(false);
        };
        load();
        return () => {
            isMounted = false;
        };
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!message.trim()) {
            setError('Please add a message before signing.');
            return;
        }

        setSaving(true);
        const res = await signGuestbook({ displayName, message });
        if (res?.error) {
            setError(res.error);
            setSaving(false);
            return;
        }

        setEntries((prev) => {
            const filtered = prev.filter(
                (entry) =>
                    entry._id !== res._id &&
                    (typeof entry.user === 'object' ? entry.user?._id : entry.user) !== user?._id
            );
            return sortEntries([res, ...filtered]);
        });
        setSuccess(myEntry ? 'Updated your signature.' : 'Thanks for signing!');
        setSaving(false);
    };

    const handleDeleteMine = async () => {
        const res = await deleteMyGuestbookEntry();
        if (res?.error) {
            setError(res.error);
            return;
        }
        setEntries((prev) => prev.filter((entry) => entry._id !== res._id));
        setMessage('');
        setSuccess('Removed your signature.');
    };

    return (
        <div className="contact-grid" style={{ width: '100%' }}>
            <div className="contact-grid__info">
                <p style={{ color: 'rgba(226,232,240,0.82)' }}>
                    Sign the guest book to leave a note. You can update or remove your entry
                    anytime.
                </p>
                <div className="contact-grid__card">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <div>
                            <div className="section__eyebrow">Latest notes</div>
                            <h3 style={{ margin: '4px 0 0' }}>Guest book</h3>
                        </div>
                        {loading && (
                            <span style={{ color: 'rgba(148,163,184,0.9)', fontSize: '0.95rem' }}>
                                Loading...
                            </span>
                        )}
                    </div>

                    {entries.length === 0 && !loading && <p>No signatures yet. Be the first!</p>}

                    {entries.map((entry) => (
                        <div
                            key={entry._id}
                            style={{
                                borderBottom: '1px solid rgba(148,163,184,0.2)',
                                padding: '10px 0'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline',
                                    gap: '10px'
                                }}
                            >
                                <strong>{entry.displayName}</strong>
                                <span
                                    style={{ fontSize: '0.85rem', color: 'rgba(148,163,184,0.9)' }}
                                >
                                    {formatDate(entry.updatedAt)}
                                </span>
                            </div>
                            <div style={{ marginTop: '6px', color: 'rgba(226,232,240,0.92)' }}>
                                {entry.message}
                            </div>
                            {myEntry?._id === entry._id && (
                                <div
                                    style={{
                                        marginTop: '6px',
                                        fontSize: '0.9rem',
                                        color: 'rgba(96,165,250,0.85)'
                                    }}
                                >
                                    This is your note.
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="contact-grid__form">
                <div className="section__eyebrow">Sign</div>
                <h3 style={{ margin: '4px 0 12px' }}>
                    {myEntry ? 'Update your note' : 'Leave a note in the guest book'}
                </h3>
                <form className="contact-form" onSubmit={handleSubmit}>
                    <label>
                        Name
                        <input
                            type="text"
                            name="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your name or alias"
                            required
                        />
                    </label>
                    <label>
                        Message
                        <textarea
                            rows="4"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Share a thought, a hello, or feedback."
                            required
                        />
                    </label>
                    {error && <p className="contact-form__error">{error}</p>}
                    {success && <p className="contact__success">{success}</p>}
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap',
                            alignItems: 'center'
                        }}
                    >
                        <button
                            className="btn contact-form__submit"
                            type="submit"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : myEntry ? 'Update entry' : 'Sign guest book'}
                        </button>
                        {myEntry && (
                            <button
                                type="button"
                                className="btn btn--ghost"
                                onClick={handleDeleteMine}
                            >
                                Remove my entry
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
