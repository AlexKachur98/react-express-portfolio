import React from 'react';
import ResumeIcon from '../icons/ResumeIcon.jsx';
import LinkedInIcon from '../icons/LinkedInIcon.jsx';
import GithubIcon from '../icons/GithubIcon.jsx';

export default function AboutSection() {
    return (
        <section id="about" className="section">
            <div className="section__grid">
                <div>
                    <span className="section__eyebrow">About</span>
                    <h2 className="section__heading">Curious by nature. Builder by choice.</h2>
                    <p>
                        Hi, I’m Alex — a Software Engineering Technology student at Centennial College with a passion for building
                        modern web applications and exploring emerging technologies.
                    </p>
                    <p>
                        I was the kid taking apart radios and DVD players to understand how every part worked. During lockdown, a free HTML
                        course reignited that curiosity and led me to pursue software engineering. Today, I’m building games in C#, architecting
                        React applications, and designing maintainable systems with clear documentation.
                    </p>
                    <p>
                        Outside of development, you’ll find me gaming, following the NBA, NFL, and MMA, or building custom PCs. I share life
                        with my cats Moura and Simba, and my dream is to one day open an animal rescue ranch.
                    </p>
                </div>
                <div className="about__media">
                    <div className="about__card">
                        <img
                            src="/assets/headshot.webp"
                            alt="Headshot of Alex Kachur"
                            loading="lazy"
                        />
                    </div>
                    <div className="about__links" aria-label="Personal links">
                        <a
                            href="/assets/resume.pdf"
                            className="about__link"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open resume PDF"
                        >
                            <ResumeIcon className="about__link-icon" />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/alex-kachur"
                            className="about__link"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit Alex's LinkedIn profile"
                        >
                            <LinkedInIcon className="about__link-icon" />
                        </a>
                        <a
                            href="https://github.com/AlexKachur98"
                            className="about__link"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Visit Alex's GitHub profile"
                        >
                            <GithubIcon className="about__link-icon" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
