/**
 * @file AdminLayout.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Shared shell for admin pages with navigation and signout control.
 */

// React
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

// Context
import { useAuth } from '../context/AuthContext.jsx';

const NAV_LINKS = [
    { label: 'Overview', to: '/admin' },
    { label: 'Users', to: '/admin/users' },
    { label: 'Education', to: '/admin/education' },
    { label: 'Projects', to: '/admin/projects' },
    { label: 'Services', to: '/admin/services' },
    { label: 'Gallery', to: '/admin/gallery' },
    { label: 'Messages', to: '/admin/messages' },
    { label: 'Guestbook', to: '/admin/guestbook' }
];

export default function AdminLayout() {
    const { signout } = useAuth();
    const navigate = useNavigate();

    const handleSignout = async () => {
        await signout();
        navigate('/');
    };

    return (
        <div className="section section--glass admin">
            <div className="cat-gallery__back">
                <button type="button" onClick={() => navigate('/')} aria-label="Back to portfolio">
                    <span aria-hidden="true">←</span>
                    <span>Back to Portfolio</span>
                </button>
            </div>
            <header className="admin__header">
                <div>
                    <h2 className="section__heading admin__title">Dashboard</h2>
                </div>
                <button type="button" className="btn btn--ghost" onClick={handleSignout}>
                    Sign out
                </button>
            </header>

            <div className="admin__content">
                <nav className="admin__nav">
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/admin'}
                            className={({ isActive }) =>
                                `btn btn--ghost ${isActive ? 'btn--ghost-active' : ''}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="admin__main">
                <Outlet />
            </div>
        </div>
    );
}
