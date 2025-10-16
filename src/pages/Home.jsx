/**
 * @file Home.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component renders the Home page of the portfolio.
 */
import React from 'react';

export default function Home() {
    return (
        <div>
            <h1>Welcome to My Personal Portfolio</h1>
            <p>
                <strong>Mission Statement:</strong> To leverage my passion for technology and problem-solving to build clean,
                maintainable, and accessible software solutions.
            </p>

            <p>
                <Link to="/about" className="btn">Learn More About Me</Link>
            </p>
        </div>
    );
}