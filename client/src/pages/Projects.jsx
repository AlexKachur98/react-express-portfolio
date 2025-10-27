/**
 * @file Projects.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component renders the Projects page of the portfolio.
 */
import React from 'react';

// Project data stored in an array of objects for easy mapping.
const myProjects = [
    {
        title: 'C# Hangman Game',
        description: 'A console-based word guessing game built in C# applying OOP basics.',
        tags: ['C#', 'OOP', 'Game'],
        imageUrl: 'assets/project-hangman.webp',
    },
    {
        title: 'Prestige Exotics Website',
        description: 'Luxury car showcase using HTML, CSS, JavaScript and jQuery animations.',
        tags: ['HTML', 'CSS', 'JavaScript', 'jQuery'],
        imageUrl: 'assets/project-exotics.webp',
    },
    {
        title: 'UniLabBooker SRS',
        description: 'Software Requirements Specification for a lab-booking system.',
        tags: ['SRS', 'UML', 'Requirements'],
        imageUrl: 'assets/project-srs.webp',
    },
];

export default function Projects() {
    return (
        <div className="page">
            <h1>My Projects</h1>
            <p>Here are a few projects I wish to highlight.</p>

            {myProjects.map((project) => (
                <article key={project.title} className="card">
                    <img
                        src={project.imageUrl}
                        alt={`Screenshot of the ${project.title} project`}
                        className="card-image"
                    />
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>

                    <div className="tag-list">
                        {project.tags.map((tag, i) => (
                            <span key={i} className="tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                </article>
            ))}
        </div>
    );
}
