/**
 * @file MainRouter.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component defines the application's routing structure, mapping URL paths
 * to their corresponding page components.
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import CatGallery from './pages/CatGallery.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminEducation from './pages/AdminEducation.jsx';
import AdminProjects from './pages/AdminProjects.jsx';
import AdminServices from './pages/AdminServices.jsx';

const MainRouter = () => {
    return (
        <Routes>
            {/* The Layout component acts as the parent route for all pages */}
            <Route path="/" element={<Layout />}>
                {/* The index route renders the Home component at the root URL */}
                <Route index element={<Home />} />
                <Route path="cats" element={<CatGallery />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="signup" element={<SignUp />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="education" element={<AdminEducation />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="gallery" element={<div className="section section--glass"><h2>Admin Gallery</h2></div>} />
                <Route path="contacts" element={<div className="section section--glass"><h2>Admin Contacts</h2></div>} />
            </Route>
        </Routes>
    );
}
export default MainRouter;
