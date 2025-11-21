import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';

const ADMIN_LINKS = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Education', path: '/admin/education' },
    { label: 'Projects', path: '/admin/projects' },
    { label: 'Services', path: '/admin/services' },
    { label: 'Gallery', path: '/admin/gallery' },
    { label: 'Contacts', path: '/admin/contacts' }
];

export default function AdminLayout() {
    const { isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            navigate('/signin', { replace: true });
        }
    }, [isAuthenticated, isAdmin, navigate]);

    if (!isAuthenticated || !isAdmin) {
        return null;
    }

    return (
        <div className="section section--glass" style={{ minHeight: '80vh' }}>
            <div className="section__eyebrow">Admin</div>
            <h2 className="section__heading">Control Panel</h2>
            <div className="admin-nav" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {ADMIN_LINKS.map((link) => (
                    <button
                        key={link.path}
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => navigate(link.path)}
                    >
                        {link.label}
                    </button>
                ))}
            </div>
            <Outlet />
        </div>
    );
}
