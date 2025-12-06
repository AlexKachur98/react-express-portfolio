/**
 * @file SignUp.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Account creation form with client-side validation.
 */

// React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Context & Hooks
import { useAuth } from '../context/AuthContext.jsx';
import useForm, { validators, createValidator } from '../hooks/useForm.js';

// Client-side validation rules
const validate = createValidator({
    name: [validators.required, validators.minLength(2)],
    email: [validators.required, validators.email],
    password: [validators.required, validators.minLength(8)]
});

export default function SignUp() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        setRevealed(true);
    }, []);

    const { values, handleChange, handleBlur, getFieldError, validateForm, reset } = useForm(
        { name: '', email: '', password: '' },
        validate
    );

    const onSubmit = async (event) => {
        event.preventDefault();
        setServerError('');
        setSuccessMsg('');

        // Validate before submitting
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const res = await signup({
            name: values.name,
            email: values.email,
            password: values.password
        });

        if (res?.error) {
            setServerError(res.error);
            setLoading(false);
            return;
        }

        setSuccessMsg('Sign up successful. You can now sign in.');
        setLoading(false);
        reset();
        navigate('/signin');
    };

    const nameError = getFieldError('name');
    const emailError = getFieldError('email');
    const passwordError = getFieldError('password');

    return (
        <div className={`section section--glass ${revealed ? 'reveal-active' : ''}`}>
            <div className="section__eyebrow">Account</div>
            <h2 className="section__heading">Create Account</h2>
            <form className="contact-form" onSubmit={onSubmit} noValidate>
                <label>
                    Name
                    <input
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange('name')}
                        onBlur={handleBlur('name')}
                        aria-invalid={!!nameError}
                        aria-describedby={nameError ? 'name-error' : undefined}
                    />
                    {nameError && (
                        <span id="name-error" className="contact-form__field-error" role="alert">
                            {nameError}
                        </span>
                    )}
                </label>
                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange('email')}
                        onBlur={handleBlur('email')}
                        aria-invalid={!!emailError}
                        aria-describedby={emailError ? 'email-error' : undefined}
                    />
                    {emailError && (
                        <span id="email-error" className="contact-form__field-error" role="alert">
                            {emailError}
                        </span>
                    )}
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange('password')}
                        onBlur={handleBlur('password')}
                        aria-invalid={!!passwordError}
                        aria-describedby={passwordError ? 'password-error' : undefined}
                    />
                    {passwordError && (
                        <span
                            id="password-error"
                            className="contact-form__field-error"
                            role="alert"
                        >
                            {passwordError}
                        </span>
                    )}
                </label>
                {serverError && (
                    <p className="contact-form__error" role="alert">
                        {serverError}
                    </p>
                )}
                {successMsg && (
                    <p className="contact__success" role="status">
                        {successMsg}
                    </p>
                )}
                <button className="btn contact-form__submit" type="submit" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
                <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                    Already have an account? <a href="/signin">Sign in</a>
                </p>
            </form>
        </div>
    );
}
