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
import AdminApp from './admin/AdminApp.jsx';
import GuestbookApp from './guestbook/GuestbookApp.jsx';

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
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/guestbook" element={<GuestbookApp />} />
        </Routes>
    );
};
export default MainRouter;
