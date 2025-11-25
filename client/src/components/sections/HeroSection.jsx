/**
 * @file HeroSection.jsx
 * @author Alex Kachur
 * @since 2025-10-28
 * @purpose Landing hero introducing the portfolio voice, CTA, and animated typewriter lead-in.
 */
import Typewriter from '../Typewriter.jsx';

export default function HeroSection({ heroLines, onWelcomeClick }) {
    return (
        <section id="home" className="section hero">
            <button type="button" className="hero__tag" onClick={onWelcomeClick}>
                Welcome, I&apos;m Alex.
            </button>
            <h1 className="hero__title">I build thoughtful digital experiences.</h1>
            <Typewriter phrases={heroLines} />
            <p className="hero__subtitle">
                My mission is to leverage technology and clean, maintainable code to solve real problems and support the people around me.
            </p>
            <div className="hero__actions">
                {/* Smooth-scroll buttons stay within the SPA while keeping anchor semantics. */}
                <a
                    className="btn btn--primary"
                    href="#projects"
                    onClick={(event) => {
                        event.preventDefault();
                        document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    View Projects
                </a>
                <a
                    className="btn btn--ghost"
                    href="#contact"
                    onClick={(event) => {
                        event.preventDefault();
                        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    Let&apos;s Talk
                </a>
            </div>
        </section>
    );
}
