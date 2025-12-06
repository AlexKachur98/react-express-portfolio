/**
 * @file AdminLogin.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Handles the admin authentication flow and redirects to the dashboard.
 */

// React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Context
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLogin() {
    const { signin, signout, isAdmin, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAdmin) {
            navigate('/admin', { replace: true });
        }
    }, [isAdmin, navigate]);

    const onSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const res = await signin({ email, password });
        if (res?.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        if (res?.user?.role !== 'admin') {
            setError('Admin account required.');
            await signout();
            setLoading(false);
            return;
        }

        navigate('/admin', { replace: true });
    };

    const showNonAdminWarning = user && user.role !== 'admin';

    return (
        <div className="section section--glass">
            <div className="section__eyebrow">Admin</div>
            <h2 className="section__heading">Sign in to continue</h2>
            {showNonAdminWarning && (
                <>
                    <p className="contact-form__error">
                        Admin access required. Please sign in with an admin account.
                    </p>
                    <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={signout}
                        style={{ marginBottom: '12px' }}
                    >
                        Sign out current session
                    </button>
                </>
            )}
            <form className="contact-form" onSubmit={onSubmit}>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {error && <p className="contact-form__error">{error}</p>}
                <button className="btn contact-form__submit" type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}
