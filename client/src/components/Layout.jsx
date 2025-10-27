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
        <>
            {/* The header section contains the logo and navigation */}
            <header>
                <h1>Alex Kachur's Portfolio Logo</h1> {/* Placeholder for your custom logo */}
                <nav>
                    <Link to="/">Home</Link> |
                    <Link to="/about">About</Link> |
                    <Link to="/projects">Projects</Link> |
                    <Link to="/education">Education</Link> |
                    <Link to="/services">Services</Link> |
                    <Link to="/contact">Contact</Link>
                </nav>
            </header>
            <hr />

            {/* The main content area where the active page component will be rendered */}
            <main>
                <Outlet />
            </main>
        </>
    );
}