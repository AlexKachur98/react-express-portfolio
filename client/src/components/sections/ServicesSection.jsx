import React from 'react';

export default function ServicesSection({ services }) {
    return (
        <section id="services" className="section">
            <span className="section__eyebrow">Services</span>
            <h2 className="section__heading">How I can help</h2>
            <div className="service-grid">
                {services.map((service) => (
                    <article key={service.title} className="service-card">
                        <h3>{service.title}</h3>
                        <p>{service.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
