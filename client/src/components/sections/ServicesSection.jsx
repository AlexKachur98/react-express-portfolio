/**
 * @file ServicesSection.jsx
 * @author Alex Kachur
 * @since 2025-10-28
 * @purpose Communicate service offerings with concise summaries and optional illustrative icons.
 */
import { memo } from 'react';

function ServicesSection({ services }) {
    return (
        <section id="services" className="section">
            <span className="section__eyebrow">Services</span>
            <h2 className="section__heading">How I can help</h2>
            <div className="service-grid">
                {services.map((service) => (
                    <article key={service.title} className="service-card">
                        <div className="service-card__content">
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </div>
                        {/* Icons are optional per card, so guard the render and keep alt text configurable. */}
                        {service.icon && (
                            <img
                                src={service.icon}
                                alt={service.iconLabel ?? ''}
                                className="service-card__icon"
                                loading="lazy"
                            />
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
}

export default memo(ServicesSection);
