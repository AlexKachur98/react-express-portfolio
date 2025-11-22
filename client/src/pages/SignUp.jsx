import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function SignUp() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        const res = await signup({ name, email, password });
        if (res?.error) {
            setError(res.error);
            setLoading(false);
            return;
        }

        setSuccessMsg('Sign up successful. You can now sign in.');
        setLoading(false);
        navigate('/signin');
    };

    return (
        <div className="section section--glass">
            <div className="section__eyebrow">Account</div>
            <h2 className="section__heading">Create Account</h2>
            <form className="contact-form" onSubmit={onSubmit}>
                <label>
                    Name
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
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
                {successMsg && <p className="contact__success">{successMsg}</p>}
                <button className="btn contact-form__submit" type="submit" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
}
