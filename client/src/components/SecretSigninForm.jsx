import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function SecretSigninForm({ onClose }) {
    const { signin, signup } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        if (mode === 'signin') {
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
            return;
        }

        const signupRes = await signup({ name, email, password });
        if (signupRes?.error) {
            setError(signupRes.error);
            setLoading(false);
            return;
        }

        // Auto sign in the new user so the flow feels seamless.
        const signinRes = await signin({ email, password });
        if (signinRes?.error) {
            setError(signinRes.error);
            setLoading(false);
            return;
        }

        navigate('/');
        if (typeof onClose === 'function') {
            onClose();
        }
        setLoading(false);
    };

    return (
        <div className="secret-login">
            <header className="secret-login__header">
                <span className="section__eyebrow">Secret</span>
                <h2 className="secret-login__title">
                    {mode === 'signin' ? 'Backstage access' : 'Join the crew'}
                </h2>
                <p className="secret-login__hint">
                    {mode === 'signin'
                        ? 'Sign in to slip into the admin dashboard — or your account — without leaving the homepage.'
                        : 'Create a regular account in seconds, then we will sign you in right away.'}
                </p>
            </header>

            <div className="secret-login__toggle">
                <button
                    type="button"
                    className={`secret-login__chip ${mode === 'signin' ? 'secret-login__chip--active' : ''}`}
                    onClick={() => { setMode('signin'); setError(''); }}
                >
                    Sign in
                </button>
                <button
                    type="button"
                    className={`secret-login__chip ${mode === 'signup' ? 'secret-login__chip--active' : ''}`}
                    onClick={() => { setMode('signup'); setError(''); }}
                >
                    Create account
                </button>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
                {mode === 'signup' && (
                    <label>
                        Name
                        <input
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                )}

                <label>
                    Email
                    <input
                        type="email"
                        autoComplete={mode === 'signin' ? 'email' : 'username'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                {error && <p className="contact-form__error">{error}</p>}

                <button className="btn contact-form__submit" type="submit" disabled={loading}>
                    {loading
                        ? mode === 'signin' ? 'Signing in...' : 'Creating account...'
                        : mode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
            </form>
        </div>
    );
}
