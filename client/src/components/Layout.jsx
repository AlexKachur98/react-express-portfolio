/**
 * @file Layout.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component defines the shared layout for the application, 
 * including the navigation bar and the area for rendering page content.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import VantaBackground from './VantaBackground.jsx';

const NAV_LINKS = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Education', href: '#education' },
    { name: 'Projects', href: '#projects' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
];

export default function Layout() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 12);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = useCallback((href) => {
        if (!href.startsWith('#')) {
            window.location.href = href;
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    return (
        <div className="app-shell">
            <VantaBackground />

            {/* Floating navigation tray */}
            <header className={`floating-nav ${scrolled ? 'floating-nav--scrolled' : ''}`}>
                <div className="floating-nav__inner">
                    <button
                        type="button"
                        className="floating-nav__brand"
                        onClick={() => handleNavClick('#home')}
                    >
                        <span className="floating-nav__brandmark">AK</span>
                        <span className="floating-nav__brandtext">
                            Alex Kachur
                            <small>Software Engineering Technology Student</small>
                        </span>
                    </button>

                    <nav className="floating-nav__links" aria-label="Primary navigation">
                        {NAV_LINKS.map((item) => (
                            <button
                                key={item.name}
                                type="button"
                                className="floating-nav__link"
                                onClick={() => handleNavClick(item.href)}
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            {/* The main content area where the active page component will be rendered */}
            <main className="app-main">
                <Outlet />
            </main>
        </div>
    );
}
