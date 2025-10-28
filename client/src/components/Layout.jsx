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
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 12);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 640) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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

    const handleNavSelection = (href) => {
        handleNavClick(href);
        setMenuOpen(false);
    };

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

                    <button
                        type="button"
                        className={`floating-nav__toggle ${menuOpen ? 'floating-nav__toggle--open' : ''}`}
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-expanded={menuOpen}
                        aria-controls="primary-navigation"
                    >
                        <span className="floating-nav__toggle-line" />
                        <span className="floating-nav__toggle-line" />
                        <span className="floating-nav__toggle-line" />
                        <span className="floating-nav__toggle-label">{menuOpen ? 'Close' : 'Menu'}</span>
                    </button>

                    <nav
                        id="primary-navigation"
                        className={`floating-nav__links ${menuOpen ? 'floating-nav__links--open' : ''}`}
                        aria-label="Primary navigation"
                    >
                        {NAV_LINKS.map((item) => (
                            <button
                                key={item.name}
                                type="button"
                                className="floating-nav__link"
                                onClick={() => handleNavSelection(item.href)}
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
