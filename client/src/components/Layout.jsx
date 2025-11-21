/**
 * @file Layout.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component defines the shared layout for the application, 
 * including the navigation bar and the area for rendering page content.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import VantaBackground from './VantaBackground.jsx';

const NAV_LINKS = [
    { name: 'Home', href: '#home', type: 'anchor' },
    { name: 'About', href: '#about', type: 'anchor' },
    { name: 'Education', href: '#education', type: 'anchor' },
    { name: 'Projects', href: '#projects', type: 'anchor' },
    { name: 'Services', href: '#services', type: 'anchor' },
    { name: 'Contact', href: '#contact', type: 'anchor' },
    { name: 'Cat Gallery', href: '/cats', type: 'route' },
];

export default function Layout() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isCatGallery = location.pathname.startsWith('/cats');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 12);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Collapse the tray when returning to desktop widths so the layout
        // doesn't leave the mobile menu hanging open after a resize.
        const handleResize = () => {
            if (window.innerWidth > 900) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let previousRestoration;
        if ('scrollRestoration' in window.history) {
            previousRestoration = window.history.scrollRestoration;
            window.history.scrollRestoration = 'manual';
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

        return () => {
            if (previousRestoration) {
                window.history.scrollRestoration = previousRestoration;
            }
        };
    }, [location.pathname]);

    const handleNavClick = useCallback((href, type) => {
        if (type === 'route') {
            navigate(href);
            return;
        }

        if (href === '#home') {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            return;
        }

        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [navigate]);

    const handleNavSelection = (href, type) => {
        handleNavClick(href, type);
        setMenuOpen(false);
    };

    return (
        <div className="app-shell">
            {!isCatGallery && <VantaBackground />}

            {isCatGallery ? (
                <div className="cat-gallery__back">
                    <button type="button" onClick={() => navigate('/')} aria-label="Back to portfolio">
                        <span aria-hidden="true">←</span>
                        <span>Back to Portfolio</span>
                    </button>
                </div>
            ) : (
                <header className={`floating-nav ${scrolled ? 'floating-nav--scrolled' : ''}`}>
                    <div className="floating-nav__inner">
                        <button
                            type="button"
                            className={`floating-nav__toggle ${menuOpen ? 'floating-nav__toggle--open' : ''}`}
                            onClick={() => setMenuOpen((prev) => !prev)}
                            aria-expanded={menuOpen}
                            aria-controls="primary-navigation"
                            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        >
                            <span className="floating-nav__toggle-label">
                                {menuOpen ? 'Close' : 'Menu'}
                            </span>
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
                                    onClick={() => handleNavSelection(item.href, item.type)}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </header>
            )}

            <main className={`app-main ${isCatGallery ? 'app-main--cat' : ''}`}>
                <Outlet />
            </main>
        </div>
    );
}
