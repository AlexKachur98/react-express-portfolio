/**
 * @file GuestbookApp.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Orchestrates the guest book experience and guards it behind authentication.
 */
import GuestbookLayout from './GuestbookLayout.jsx';
import GuestbookBoard from './GuestbookBoard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import SecretSigninForm from '../components/SecretSigninForm.jsx';

export default function GuestbookApp() {
    const { isAuthenticated, initializing } = useAuth();

    let content;
    if (initializing) {
        content = (
            <GuestbookLayout showSignout={false}>
                <div className="contact-grid__card">
                    <div className="section__eyebrow">Guest</div>
                    <h3 style={{ marginTop: 0 }}>Loading your guest book...</h3>
                    <p>Please wait while we restore your session.</p>
                </div>
            </GuestbookLayout>
        );
    } else if (!isAuthenticated) {
        content = (
            <GuestbookLayout showSignout={false}>
                <div className="contact-grid__card">
                    <div className="section__eyebrow">Sign in</div>
                    <h3 style={{ marginTop: 0 }}>Secret guest access</h3>
                    <p style={{ marginTop: 4, marginBottom: 12 }}>Use the secret form below to sign the guest book.</p>
                    <SecretSigninForm />
                </div>
            </GuestbookLayout>
        );
    } else {
        content = (
            <GuestbookLayout>
                <GuestbookBoard />
            </GuestbookLayout>
        );
    }

    return (
        <div className="admin-shell">
            {content}
        </div>
    );
}
