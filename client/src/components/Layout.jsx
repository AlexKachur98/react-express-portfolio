/**
 * @file Layout.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component defines the shared layout for the application, 
 * including the navigation bar and the area for rendering page content.
 */
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="app-shell">
            {/* The header section contains the logo and navigation */}
            <header className="app-header">
                <div className="brand">
                    <h1>Alex Kachur</h1>
                    <p className="tagline">Software Engineering Technology Student</p>
                </div>
                <nav className="app-nav" aria-label="Primary navigation">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/projects">Projects</Link>
                    <Link to="/education">Education</Link>
                    <Link to="/services">Services</Link>
                    <Link to="/contact">Contact</Link>
                </nav>
            </header>

            {/* The main content area where the active page component will be rendered */}
            <main className="app-main">
                <Outlet />
            </main>
        </div>
    );
}
