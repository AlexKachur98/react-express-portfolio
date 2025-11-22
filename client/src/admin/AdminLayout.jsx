import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_LINKS = [
    { label: 'Overview', to: '/admin' },
    { label: 'Education', to: '/admin/education' },
    { label: 'Projects', to: '/admin/projects' },
    { label: 'Services', to: '/admin/services' },
    { label: 'Gallery', to: '/admin/gallery' },
    { label: 'Messages', to: '/admin/messages' }
];

export default function AdminLayout() {
    const { signout } = useAuth();
    const navigate = useNavigate();

    const handleSignout = async () => {
        await signout();
        navigate('/');
    };

    return (
        <div className="section section--glass" style={{ minHeight: '80vh' }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
                <div>
                    <div className="section__eyebrow">Admin</div>
                    <h2 className="section__heading" style={{ marginBottom: 0 }}>Dashboard</h2>
                </div>
                <button type="button" className="btn btn--ghost" onClick={handleSignout}>
                    Sign out
                </button>
            </header>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <nav style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/admin'}
                            className={({ isActive }) => `btn btn--ghost ${isActive ? 'btn--ghost-active' : ''}`}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div style={{ marginTop: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
}
