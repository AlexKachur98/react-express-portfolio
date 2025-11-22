/**
 * @file AdminApp.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Wires up the admin routes and gates access based on authentication state.
 */
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AdminLogin from './AdminLogin.jsx';
import AdminLayout from './AdminLayout.jsx';
import AdminOverview from './AdminOverview.jsx';
import AdminUsers from './AdminUsers.jsx';
import AdminEducation from './AdminEducation.jsx';
import AdminProjects from './AdminProjects.jsx';
import AdminServices from './AdminServices.jsx';
import AdminGallery from './AdminGallery.jsx';
import AdminMessages from './AdminMessages.jsx';
import AdminGuestbook from './AdminGuestbook.jsx';

export default function AdminApp() {
    const { isAdmin, initializing } = useAuth();

    let content;

    if (initializing) {
        content = (
            <div className="section section--glass">
                <div className="section__eyebrow">Admin</div>
                <h2 className="section__heading">Loading...</h2>
                <p>Please wait while we restore your session.</p>
            </div>
        );
    } else if (!isAdmin) {
        content = <AdminLogin />;
    } else {
        content = (
            <Routes>
                <Route element={<AdminLayout />}>
                    <Route index element={<AdminOverview />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="education" element={<AdminEducation />} />
                    <Route path="projects" element={<AdminProjects />} />
                    <Route path="services" element={<AdminServices />} />
                    <Route path="gallery" element={<AdminGallery />} />
                    <Route path="messages" element={<AdminMessages />} />
                    <Route path="guestbook" element={<AdminGuestbook />} />
                </Route>
            </Routes>
        );
    }

    return (
        <div className="admin-shell">
            {content}
        </div>
    );
}
