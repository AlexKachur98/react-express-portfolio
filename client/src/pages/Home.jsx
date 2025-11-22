/**
 * @file Home.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component renders the Home page of the portfolio.
 */
import React, { useEffect, useState } from 'react';
import HeroSection from '../components/sections/HeroSection.jsx';
import AboutSection from '../components/sections/AboutSection.jsx';
import EducationSection from '../components/sections/EducationSection.jsx';
import ProjectsSection from '../components/sections/ProjectsSection.jsx';
import ServicesSection from '../components/sections/ServicesSection.jsx';
import ContactSection from '../components/sections/ContactSection.jsx';
import { getProjects, getQualifications, getServices, postContact } from '../utils/api.js';
import SignIn from './SignIn.jsx';

const heroLines = [
    'Software Engineering Technology Student.',
    'React and Node developer crafting modern web apps.',
    'Problem solver. Team player. Lifelong learner.',
];

const fallbackEducation = [
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

const fallbackProjects = [
    {
        title: 'C# Hangman Game',
        description: 'A console-based word guessing game built in C# applying OOP basics.',
        tags: ['C#', 'OOP', 'Game'],
        image: '/assets/project-hangman.webp',
        github: 'https://github.com/AlexKachur98/csharp-hangman-game',
    },
    {
        title: 'Prestige Exotics Website',
        description: 'Luxury car showcase using HTML, CSS, JavaScript and jQuery animations.',
        tags: ['HTML', 'CSS', 'JavaScript', 'jQuery'],
        image: '/assets/project-exotics.webp',
        github: 'https://github.com/AlexKachur98/comp125-dealership-website',
        live: 'https://studentweb.cencol.ca/akachur/COMP125%20Assignment%2006/home.html',
    },
    {
        title: 'React + Express Portfolio',
        description: 'This site – a full-stack portfolio with animated sections, contact form, and CMS-ready backend.',
        tags: ['React', 'Express', 'Node.js'],
        image: '/assets/portfolio.webp',
        github: 'https://github.com/AlexKachur98/react-express-portfolio',
        live: 'https://AlexKachur.dev',
    },
];

const fallbackServices = [
    {
        title: 'General Programming',
        description: 'Clean, readable problem solving across C#, Java, and Python.',
        icon: '/assets/python-svgrepo-com.svg',
        iconLabel: 'Python icon',
    },
    {
        title: 'Web Development',
        description: 'Building responsive, accessible UIs with React, Node.js, and JavaScript.',
        icon: '/assets/react-svgrepo-com.svg',
        iconLabel: 'React logo',
    },
    {
        title: 'Databases & SQL',
        description: 'Designing relational schemas, ERDs, and performant SQL queries.',
        icon: '/assets/sql-database-generic-svgrepo-com.svg',
        iconLabel: 'Database icon',
    },
    {
        title: 'Version Control',
        description: 'Git & GitHub workflows, branching strategies, and collaboration support.',
        icon: '/assets/github-142-svgrepo-com.svg',
        iconLabel: 'GitHub mark',
    },
    {
        title: 'Custom PCs',
        description: 'Parts selection, builds, and optimisation from budget to water-cooled systems.',
        icon: '/assets/pc-creator-svgrepo-com.svg',
        iconLabel: 'PC builder icon',
    },
    {
        title: 'Peer Mentorship',
        description: 'Code reviews, debugging support, and study plans that accelerate learning.',
        icon: '/assets/team-svgrepo-com.svg',
        iconLabel: 'Team collaboration icon',
    },
];

export default function Home() {
    // Track accordion progress plus form state so the contact CTA feels responsive.
    const [openEducation, setOpenEducation] = useState(0);
    const [educationItems, setEducationItems] = useState([]);
    const [projects, setProjects] = useState([]);
    const [services, setServices] = useState([]);
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
        error: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSecretSignin, setShowSecretSignin] = useState(false);

    const handleToggle = (index) => {
        setOpenEducation((prev) => (prev === index ? -1 : index));
    };

    const handleChange = (name) => (event) => {
        setValues((prev) => ({ ...prev, [name]: event.target.value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Bail early if a request is already inflight so we do not spam the API.
        if (isSubmitting) {
            return;
        }

        const contact = {
            firstName: values.firstName || undefined,
            lastName: values.lastName || undefined,
            email: values.email || undefined,
            message: values.message || undefined
        };

        try {
            setValues((prev) => ({ ...prev, error: '' }));
            setIsSubmitting(true);
            const data = await postContact(contact);

            if (!data.error) {
                setIsSubmitted(true);
                setValues(() => ({
                    firstName: '',
                    lastName: '',
                    email: '',
                    message: '',
                    error: '',
                }));
            } else {
                setValues((prev) => ({ ...prev, error: data.error || 'Something went wrong.' }));
            }
        } catch (err) {
            console.error('Submission failed:', err);
            setValues((prev) => ({ ...prev, error: 'Could not send message. Please try again later.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
            return undefined;
        }

        // Trigger reveal animations as sections scroll into view for progressive storytelling.
        const sections = document.querySelectorAll('.section');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    entry.target.classList.remove('reveal-exit');
                } else {
                    entry.target.classList.add('reveal-exit');
                    entry.target.classList.remove('reveal-active');
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const loadData = async () => {
            const [eduRes, projRes, svcRes] = await Promise.allSettled([
                getQualifications(),
                getProjects(),
                getServices()
            ]);

            const eduData = eduRes.status === 'fulfilled' && !eduRes.value?.error && Array.isArray(eduRes.value)
                ? eduRes.value
                : fallbackEducation;
            const projData = projRes.status === 'fulfilled' && !projRes.value?.error && Array.isArray(projRes.value)
                ? projRes.value
                : fallbackProjects;
            const svcData = svcRes.status === 'fulfilled' && !svcRes.value?.error && Array.isArray(svcRes.value)
                ? svcRes.value
                : fallbackServices;

            const mappedEducation = (eduData || []).map((item, idx) => ({
                program: item.program || item.title || fallbackEducation[0].program,
                school: item.school || item.title || 'Education',
                period: item.period || item.completion || 'In progress',
                location: item.location || 'Toronto, Canada',
                details: Array.isArray(item.details)
                    ? item.details
                    : item.description
                        ? [item.description]
                        : fallbackEducation[0].details,
                _id: item._id || idx
            }));

            const mappedProjects = (projData || []).map((item, idx) => ({
                title: item.title || `Project ${idx + 1}`,
                description: item.description || 'Project description coming soon.',
                tags: Array.isArray(item.tags) && item.tags.length > 0
                    ? item.tags
                    : item.category
                        ? [item.category]
                        : ['Portfolio'],
                image: item.image || item.imageUrl || '/assets/portfolio.webp',
                github: item.github || item.projectUrl || '',
                live: item.live || '',
                _id: item._id || idx
            }));

            const mappedServices = (svcData || []).map((item, idx) => ({
                title: item.title || `Service ${idx + 1}`,
                description: item.description || 'Details coming soon.',
                icon: item.icon || '',
                iconLabel: item.iconLabel || '',
                _id: item._id || idx
            }));

            setEducationItems(mappedEducation.length ? mappedEducation : fallbackEducation);
            setProjects(mappedProjects.length ? mappedProjects : fallbackProjects);
            setServices(mappedServices.length ? mappedServices : fallbackServices);
        };

        loadData();
    }, []);

    return (
        <div className="landing">
            <HeroSection heroLines={heroLines} onWelcomeClick={() => setShowSecretSignin(true)} />
            <AboutSection />
            <EducationSection items={educationItems} openIndex={openEducation} onToggle={handleToggle} />
            <ProjectsSection projects={projects} />
            <ServicesSection services={services} />
            <ContactSection values={values} isSubmitted={isSubmitted} isSubmitting={isSubmitting} onChange={handleChange} onSubmit={handleSubmit} />

            <footer className="footer">
                <p>© {new Date().getFullYear()} Alex Kachur. Built with passion, curiosity, and plenty of coffee.</p>
            </footer>

            {showSecretSignin && (
                <div className="cat-gallery__modal" role="dialog" aria-modal="true">
                    <div className="cat-gallery__modal-backdrop" onClick={() => setShowSecretSignin(false)}></div>
                    <div className="cat-gallery__modal-content">
                        <button
                            type="button"
                            className="cat-gallery__modal-close"
                            aria-label="Close sign in"
                            onClick={() => setShowSecretSignin(false)}
                        >
                            ×
                        </button>
                        <SignIn onSignedIn={() => setShowSecretSignin(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
