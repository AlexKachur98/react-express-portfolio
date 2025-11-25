/**
 * @file MainRouter.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component defines the application's routing structure, mapping URL paths
 * to their corresponding page components. Uses code splitting for better performance.
 */
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';

// Lazy load routes that aren't needed immediately
const CatGallery = lazy(() => import('./pages/CatGallery.jsx'));
const SignIn = lazy(() => import('./pages/SignIn.jsx'));
const SignUp = lazy(() => import('./pages/SignUp.jsx'));
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));
const GuestbookApp = lazy(() => import('./guestbook/GuestbookApp.jsx'));

// Loading fallback component for lazy-loaded routes
const PageLoader = () => (
    <div className="page-loader" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        color: 'rgba(148, 163, 184, 0.9)'
    }}>
        Loading...
    </div>
);

const MainRouter = () => {
    return (
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
    );
};
export default MainRouter;
