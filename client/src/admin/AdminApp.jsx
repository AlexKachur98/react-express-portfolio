import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AdminLogin from './AdminLogin.jsx';
import AdminLayout from './AdminLayout.jsx';
import AdminOverview from './AdminOverview.jsx';
import AdminEducation from './AdminEducation.jsx';
import AdminProjects from './AdminProjects.jsx';
import AdminServices from './AdminServices.jsx';
import AdminGallery from './AdminGallery.jsx';
import AdminMessages from './AdminMessages.jsx';

export default function AdminApp() {
    const { isAdmin, initializing } = useAuth();

    if (initializing) {
        return (
            <div className="section section--glass">
                <div className="section__eyebrow">Admin</div>
                <h2 className="section__heading">Loading...</h2>
                <p>Please wait while we restore your session.</p>
            </div>
        );
    }

    if (!isAdmin) {
        return <AdminLogin />;
    }

    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="education" element={<AdminEducation />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="messages" element={<AdminMessages />} />
            </Route>
        </Routes>
    );
}
