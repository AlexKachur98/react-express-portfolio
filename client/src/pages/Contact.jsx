/**
 * @file Contact.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component renders the Contact page of the portfolio.
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted. Redirecting to Home page...');
        navigate('/');
    };

    return (
        <div className="page">
            <h1>Get in Touch</h1>
            <p>Whether you’re looking to collaborate, discuss a project, or just say hi — feel free to reach out!</p>

            <div className="info-card">
                <p><strong>Email:</strong> akachur@my.centennialcollege.ca</p>
                <p><strong>Phone:</strong> 647-510-5343</p>
                <p><strong>Location:</strong> Toronto • Canada</p>
            </div>

            <form onSubmit={handleSubmit} aria-label="Contact form" className="form">
                <div className="form-group">
                    <label htmlFor="firstName">First Name: </label>
                    <input type="text" id="firstName" name="firstName" required />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name: </label>
                    <input type="text" id="lastName" name="lastName" required />
                </div>
                <div className="form-group">
                    <label htmlFor="contactNumber">Contact Number: </label>
                    <input type="tel" id="contactNumber" name="contactNumber" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address: </label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message: </label>
                    <textarea id="message" name="message" required rows="4"></textarea>
                </div>
                <button type="submit">Send Message</button>
            </form>
        </div>
    );
}
