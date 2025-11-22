import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function SecretSigninForm({ onClose }) {
    const { signin } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const res = await signin({ email, password });

        if (res?.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        const user = res?.user;
        if (user?.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }

        if (typeof onClose === 'function') {
            onClose();
        }

        setLoading(false);
    };

    return (
        <div className="secret-login">
            <header className="secret-login__header">
                <span className="section__eyebrow">Secret</span>
                <h2 className="secret-login__title">Backstage access</h2>
                <p className="secret-login__hint">
                    Sign in here to slip into the admin dashboard — or your account — without leaving the homepage.
                </p>
            </header>

            <form className="contact-form" onSubmit={handleSubmit}>
                <label>
                    Email
                    <input
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                {error && <p className="contact-form__error">{error}</p>}

                <button
                    className="btn contact-form__submit"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}
