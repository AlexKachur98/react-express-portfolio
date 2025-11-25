/**
 * @file AdminUsers.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Admin view to audit users and perform deletions when necessary.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteAllUsers, deleteUser, getUsers } from '../utils/api.js';
import { formatDate, extractPaginatedData } from '../utils/helpers.js';

export default function AdminUsers() {
    const { isAdmin, user: currentUser, signout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAdmin) return;
        const load = async () => {
            const res = await getUsers();
            if (res?.error) {
                setError(res.error);
                return;
            }
            const { items: loadedUsers } = extractPaginatedData(res);
            setUsers(loadedUsers);
        };
        load();
    }, [isAdmin]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Delete this user? This cannot be undone.');
        if (!confirmed) return;
        const res = await deleteUser(id);
        if (!res?.error) {
            setUsers((prev) => prev.filter((u) => u._id !== id));
            // If user deleted themselves, sign out and redirect
            if (currentUser?._id === id) {
                await signout();
                navigate('/');
            }
        } else if (res?.error) {
            setError(res.error);
        }
    };

    const handleDeleteAll = async () => {
        const confirmed = window.confirm('Delete ALL users? This is only allowed in development.');
        if (!confirmed) return;
        setLoading(true);
        const res = await deleteAllUsers();
        if (!res?.error) {
            setUsers([]);
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
            <h2 className="section__heading">Users</h2>
            {error && <p className="contact-form__error">{error}</p>}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                <button type="button" className="btn btn--ghost" onClick={handleDeleteAll} disabled={loading}>
                    Delete all
                </button>
            </div>
            <div className="contact-grid__card">
                {users.length === 0 && <p>No users found.</p>}
                {users.map((u) => (
                    <div key={u._id} style={{ borderBottom: '1px solid rgba(148,163,184,0.2)', padding: '10px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                            <div>
                                <strong>{u.name || 'No name'}</strong> — {u.email}
                                <span style={{ marginLeft: '8px', color: 'rgba(148,163,184,0.9)' }}>({u.role || 'user'})</span>
                            </div>
                            <button type="button" className="btn btn--ghost" onClick={() => handleDelete(u._id)}>
                                Delete
                            </button>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'rgba(148,163,184,0.9)', marginTop: '4px' }}>
                            {u.createdAt ? `Created ${formatDate(u.createdAt)}` : ''}
                            {u.updatedAt ? ` • Updated ${formatDate(u.updatedAt)}` : ''}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
