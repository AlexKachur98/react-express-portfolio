import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function SignIn({ onSignedIn } = {}) {
    const { handleSignin } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const res = await handleSignin({ email, password });
        if (res?.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        navigate('/');
        if (typeof onSignedIn === 'function') {
            onSignedIn();
        }
    };

    return (
        <div className="section section--glass">
            <div className="section__eyebrow">Account</div>
            <h2 className="section__heading">Sign In</h2>
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
