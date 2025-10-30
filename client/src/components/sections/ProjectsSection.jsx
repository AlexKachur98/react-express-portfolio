/**
 * @file ProjectsSection.jsx
 * @author Alex Kachur
 * @since 2025-10-28
 * @purpose Highlight recent work with quick access to code and live demos.
 */
import React from 'react';
import ExternalLinkIcon from '../icons/ExternalLinkIcon.jsx';

export default function ProjectsSection({ projects }) {
    return (
        <section id="projects" className="section">
            <span className="section__eyebrow">Projects</span>
            <h2 className="section__heading">Selected work I&apos;m proud of</h2>
            <div className="card-grid">
                {projects.map((project) => (
                    <article key={project.title} className="project-card">
                        <div className="project-card__media">
                            <img src={project.image} alt={project.title} loading="lazy" />
                        </div>
                        <div className="project-card__body">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="project-card__tags">
                                {project.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                            <div className="project-card__links">
                                <a className="btn btn--ghost btn--with-icon" href={project.github} target="_blank" rel="noopener noreferrer">
                                    <ExternalLinkIcon className="btn__icon" />
                                    <span className="btn__label">GitHub</span>
                                </a>
                                {/* Only render the live CTA when we have a hosted URL to avoid dead links. */}
                                {project.live && (
                                    <a className="btn btn--primary btn--with-icon" href={project.live} target="_blank" rel="noopener noreferrer">
                                        <ExternalLinkIcon className="btn__icon" />
                                        <span className="btn__label">Live</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
