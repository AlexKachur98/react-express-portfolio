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

const MainRouter = () => {
    return (
        <Routes>
            {/* The Layout component acts as the parent route for all pages */}
            <Route path="/" element={<Layout />}>
                {/* The index route renders the Home component at the root URL */}
                <Route index element={<Home />} />
            </Route>
        </Routes>
    );
}
export default MainRouter;
