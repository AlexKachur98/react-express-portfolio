/**
 * @file Education.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component renders the Education page of the portfolio.
 */
import React from 'react';

export default function Education() {
    return (
        <div className="page">
            <h1>Education</h1>
            <h3>Centennial College — Software Engineering Technology (Co-op)</h3>
            <p><strong>2025 — Present • GPA: 4.39 / 4.5</strong></p>
            <p>
                A comprehensive program focused on web application development (React & Node.js), software design, databases,
                and cooperative education. My coursework and projects have sharpened both my technical expertise and collaborative skills.
            </p>
            <ul>
                <li>Developed console-based games in C# applying OOP principles.</li>
                <li>Built full-stack web applications using React and Node.js.</li>
                <li>Designed and implemented relational databases with SQL.</li>
                <li>Created and documented UML diagrams, SRS deliverables, and system models.</li>
                <li>Collaborated on team projects using Agile methodology.</li>
                <li>Gained strong foundation in QA, version control (Git), and DevOps concepts.</li>
            </ul>
        </div>
    );
}
