/**
 * @file Home.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component renders the Home page of the portfolio.
 */
import React, { useState } from 'react';
import Typewriter from '../components/Typewriter.jsx';

const heroLines = [
    'Software Engineering Technology Student.',
    'React and Node developer crafting modern web apps.',
    'Problem solver. Team player. Lifelong learner.',
];

const educationItems = [
    {
        program: 'Software Engineering Technology (Co-op)',
        school: 'Centennial College',
        period: '2025 — Present',
        location: 'Toronto, Canada',
        details: [
            'GPA 4.39 / 4.5 while building modern web applications using React and Node.js.',
            'Developed console-based games in C# applying object-oriented programming principles.',
            'Designed and implemented relational databases with SQL, ERDs, and normalized schemas.',
            'Created UML diagrams, Software Requirements Specifications, and detailed system models.',
            'Collaborated on Agile team projects, pairing clean code with strong documentation.',
            'Strengthened foundations in QA, version control, and DevOps concepts for real projects.',
        ],
    },
];

const projectCards = [
    {
        title: 'C# Hangman Game',
        description: 'A console-based word guessing game built in C# applying OOP basics.',
        tags: ['C#', 'OOP', 'Game'],
        image: '/assets/project-hangman.webp',
    },
    {
        title: 'Prestige Exotics Website',
        description: 'Luxury car showcase using HTML, CSS, JavaScript and jQuery animations.',
        tags: ['HTML', 'CSS', 'JavaScript', 'jQuery'],
        image: '/assets/project-exotics.webp',
    },
    {
        title: 'UniLabBooker SRS',
        description: 'Software Requirements Specification for a lab-booking system.',
        tags: ['SRS', 'UML', 'Requirements'],
        image: '/assets/project-srs.webp',
    },
];

const serviceCards = [
    { title: 'General Programming', description: 'Clean, readable problem solving across C#, Java, and Python.' },
    { title: 'Web Development', description: 'Building responsive, accessible UIs with React, Node.js, and JavaScript.' },
    { title: 'Databases & SQL', description: 'Designing relational schemas, ERDs, and performant SQL queries.' },
    { title: 'Version Control', description: 'Git & GitHub workflows, branching strategies, and collaboration support.' },
    { title: 'Custom PCs', description: 'Parts selection, builds, and optimisation from budget to water-cooled systems.' },
    { title: 'Peer Mentorship', description: 'Code reviews, debugging support, and study plans that accelerate learning.' },
];

export default function Home() {
    const [openEducation, setOpenEducation] = useState(0);
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
        error: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleToggle = (index) => {
        setOpenEducation((prev) => (prev === index ? -1 : index));
    };

    const handleChange = (name) => (event) => {
        setValues({ ...values, [name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const contact = {
            firstName: values.firstName || undefined,
            lastName: values.lastName || undefined,
            email: values.email || undefined,
            message: values.message || undefined
        };

        try {
            let response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contact)
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                setValues({
                    firstName: '',
                    lastName: '',
                    email: '',
                    message: '',
                    error: '',
                });
            } else {
                setValues({ ...values, error: data.error || 'Something went wrong.' });
            }
        } catch (err) {
            console.error('Submission failed:', err);
            setValues({ ...values, error: 'Could not send message. Please try again later.' });
        }
    };

    return (
        <div className="landing">
            <section id="home" className="section hero">
                <div className="hero__tag">Welcome, I&apos;m Alex.</div>
                <h1 className="hero__title">I build thoughtful digital experiences.</h1>
                <Typewriter phrases={heroLines} />
                <p className="hero__subtitle">
                    My mission is to leverage technology and clean, maintainable code to solve real problems and support the people around me.
                </p>
                <div className="hero__actions">
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

            <section id="about" className="section section--glass">
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
                        <a href="/assets/resume.pdf" className="btn btn--secondary" target="_blank" rel="noopener noreferrer">
                            View Resume
                        </a>
                    </div>
                    <div className="about__media">
                        <div className="about__card">
                            <img
                                src="/assets/headshot.webp"
                                alt="Headshot of Alex Kachur"
                                loading="lazy"
                            />
                            <div className="about__note">
                                <span>Software Engineering Technology</span>
                                <strong>Centennial College</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="education" className="section">
                <span className="section__eyebrow">Education</span>
                <h2 className="section__heading">The coursework shaping my craft</h2>
                <div className="accordion">
                    {educationItems.map((item, index) => {
                        const open = openEducation === index;
                        return (
                            <article key={item.program} className={`accordion__item ${open ? 'accordion__item--open' : ''}`}>
                                <button type="button" className="accordion__trigger" onClick={() => handleToggle(index)}>
                                    <div>
                                        <h3>{item.program}</h3>
                                        <p>{item.school} • {item.period}</p>
                                    </div>
                                    <span aria-hidden="true" className="accordion__icon">{open ? '−' : '+'}</span>
                                </button>
                                <div className="accordion__content">
                                    <ul>
                                        {item.details.map((detail) => (
                                            <li key={detail}>{detail}</li>
                                        ))}
                                    </ul>
                                    <div className="accordion__meta">{item.location}</div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section id="projects" className="section section--glass">
                <span className="section__eyebrow">Projects</span>
                <h2 className="section__heading">Selected work I&apos;m proud of</h2>
                <div className="card-grid">
                    {projectCards.map((project) => (
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
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section id="services" className="section">
                <span className="section__eyebrow">Services</span>
                <h2 className="section__heading">How I can help</h2>
                <div className="service-grid">
                    {serviceCards.map((service) => (
                        <article key={service.title} className="service-card">
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section id="contact" className="section section--glass">
                <span className="section__eyebrow">Contact</span>
                <h2 className="section__heading">Let&apos;s build something together</h2>
                <div className="contact-grid">
                    <div className="contact-grid__info">
                        <p>
                            Whether you’re looking to collaborate, discuss a project, or just say hi — feel free to reach out!
                        </p>
                        <div className="contact-grid__card">
                            <p><strong>Email:</strong> akachur@my.centennialcollege.ca</p>
                            <p><strong>Phone:</strong> 647-510-5343</p>
                            <p><strong>Location:</strong> Toronto • Canada</p>
                        </div>
                    </div>

                    <div className="contact-grid__form">
                        {isSubmitted ? (
                            <div className="contact__success">
                                <h3>Thank you!</h3>
                                <p>Your message has been sent successfully. I&apos;ll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form className="contact-form" onSubmit={handleSubmit} aria-label="Contact form">
                                <div className="contact-form__row">
                                    <label htmlFor="firstName">
                                        First Name
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            required
                                            value={values.firstName}
                                            onChange={handleChange('firstName')}
                                        />
                                    </label>
                                    <label htmlFor="lastName">
                                        Last Name
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            required
                                            value={values.lastName}
                                            onChange={handleChange('lastName')}
                                        />
                                    </label>
                                </div>
                                <label htmlFor="email">
                                    Email Address
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={values.email}
                                        onChange={handleChange('email')}
                                    />
                                </label>
                                <label htmlFor="message">
                                    Message
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows="4"
                                        value={values.message}
                                        onChange={handleChange('message')}
                                    ></textarea>
                                </label>

                                {values.error && (<p className="contact-form__error">{values.error}</p>)}

                                <button type="submit" className="btn btn--primary">
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <footer className="footer">
                <p>© {new Date().getFullYear()} Alex Kachur. Built with passion, curiosity, and plenty of coffee.</p>
            </footer>
        </div>
    );
}
