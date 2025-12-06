/**
 * @file Home.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose Main landing page with hero, about, education, projects, services, and contact sections.
 */

// React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import HeroSection from '../components/sections/HeroSection.jsx';
import AboutSection from '../components/sections/AboutSection.jsx';
import EducationSection from '../components/sections/EducationSection.jsx';
import ProjectsSection from '../components/sections/ProjectsSection.jsx';
import ServicesSection from '../components/sections/ServicesSection.jsx';
import ContactSection from '../components/sections/ContactSection.jsx';
import SecretSigninForm from '../components/common/SecretSigninForm.jsx';

// Context & Hooks
import { useAuth } from '../context/AuthContext.jsx';
import useFocusTrap from '../hooks/useFocusTrap.js';

// Utils & Constants
import { getProjects, getQualifications, getServices, postContact } from '../utils/api.js';
import {
    heroLines,
    fallbackEducation,
    fallbackProjects,
    fallbackServices
} from '../constants/fallbackData.js';
import logger from '../utils/logger.js';

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
        error: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSecretSignin, setShowSecretSignin] = useState(false);
    const { isAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const modalRef = useFocusTrap(showSecretSignin);

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
                    error: ''
                }));
            } else {
                setValues((prev) => ({ ...prev, error: data.error || 'Something went wrong.' }));
            }
        } catch (err) {
            logger.error('Submission failed:', err);
            setValues((prev) => ({
                ...prev,
                error: 'Could not send message. Please try again later.'
            }));
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

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-active');
                        entry.target.classList.remove('reveal-exit');
                    } else {
                        entry.target.classList.add('reveal-exit');
                        entry.target.classList.remove('reveal-active');
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
        );

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

            const eduData =
                eduRes.status === 'fulfilled' && !eduRes.value?.error && Array.isArray(eduRes.value)
                    ? eduRes.value
                    : fallbackEducation;
            const projData =
                projRes.status === 'fulfilled' &&
                !projRes.value?.error &&
                Array.isArray(projRes.value)
                    ? projRes.value
                    : fallbackProjects;
            const svcData =
                svcRes.status === 'fulfilled' && !svcRes.value?.error && Array.isArray(svcRes.value)
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
                tags:
                    Array.isArray(item.tags) && item.tags.length > 0
                        ? item.tags
                        : item.category
                          ? [item.category]
                          : ['Portfolio'],
                image: item.image || item.imageUrl || '/assets/projects/portfolio.webp',
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
            <HeroSection
                heroLines={heroLines}
                onWelcomeClick={() => {
                    if (isAdmin) {
                        navigate('/admin');
                        return;
                    }
                    if (isAuthenticated) {
                        navigate('/guestbook');
                        return;
                    }
                    setShowSecretSignin(true);
                }}
            />
            <AboutSection />
            <EducationSection
                items={educationItems}
                openIndex={openEducation}
                onToggle={handleToggle}
            />
            <ProjectsSection projects={projects} />
            <ServicesSection services={services} />
            <ContactSection
                values={values}
                isSubmitted={isSubmitted}
                isSubmitting={isSubmitting}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />

            <footer className="footer">
                <p>
                    © {new Date().getFullYear()} Alex Kachur. Built with passion, curiosity, and
                    plenty of coffee.
                </p>
            </footer>

            {showSecretSignin && (
                <div
                    className="cat-gallery__modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="signin-modal-title"
                >
                    <div
                        className="cat-gallery__modal-backdrop"
                        onClick={() => setShowSecretSignin(false)}
                    ></div>
                    <div className="cat-gallery__modal-content" role="document" ref={modalRef}>
                        <button
                            type="button"
                            className="cat-gallery__modal-close"
                            aria-label="Close secret sign in"
                            onClick={() => setShowSecretSignin(false)}
                        >
                            ×
                        </button>
                        <SecretSigninForm onClose={() => setShowSecretSignin(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}
