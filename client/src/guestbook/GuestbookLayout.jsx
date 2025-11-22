/**
 * @file GuestbookLayout.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Shared layout for guest book pages, handling shell chrome and signout.
 */
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function GuestbookLayout({ children, showSignout = true }) {
    const { signout, user } = useAuth();
    const navigate = useNavigate();

    const handleSignout = async () => {
        await signout();
        navigate('/');
    };

    return (
        <div className="section section--glass" style={{ minHeight: '80vh', width: 'min(1200px, 95vw)' }}>
            <div className="cat-gallery__back">
                <button type="button" onClick={() => navigate('/')} aria-label="Back to portfolio">
                    <span aria-hidden="true">←</span>
                    <span>Back to Portfolio</span>
                </button>
            </div>

            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div>
                    <h2 className="section__heading" style={{ marginBottom: 0 }}>Guest Book</h2>
                    {user?.name && (
                        <p style={{ margin: '6px 0 0', color: 'rgba(148,163,184,0.9)' }}>
                            Signed in as {user.name}
                        </p>
                    )}
                </div>
                {showSignout && (
                    <button type="button" className="btn btn--ghost" onClick={handleSignout}>
                        Sign out
                    </button>
                )}
            </header>

            <div style={{ marginTop: '12px' }}>
                {children}
            </div>
        </div>
    );
}
