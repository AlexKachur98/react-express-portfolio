import React from 'react';

export default function ContactSection({ values, isSubmitted, isSubmitting, onChange, onSubmit }) {
    return (
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
                        <form className="contact-form" onSubmit={onSubmit} aria-label="Contact form">
                            <div className="contact-form__row">
                                <label htmlFor="firstName">
                                    First Name
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        required
                                        value={values.firstName}
                                        onChange={onChange('firstName')}
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
                                        onChange={onChange('lastName')}
                                    />
                                </label>
                            </div>
                            <label htmlFor="email">
                                Email Address
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    required
                                    value={values.email}
                                    onChange={onChange('email')}
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
                                    onChange={onChange('message')}
                                ></textarea>
                            </label>

                            {values.error && (<p className="contact-form__error">{values.error}</p>)}

                            <button
                                type="submit"
                                className="btn btn--primary contact-form__submit"
                                disabled={isSubmitting}
                                aria-busy={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="contact-form__spinner" aria-hidden="true"></span>
                                        <span className="visually-hidden" role="status">Sending...</span>
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
