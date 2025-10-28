/**
 * @file Contact.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose This component renders the Contact page and handles form submission to the backend API,
 * providing on-page feedback upon success.
 */
import React, { useState } from 'react';

export default function Contact() {
    // State to manage form fields, submission errors, and success status.
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
        error: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    // A single handler for all form inputs to keep the code DRY.
    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value });
    };

    // Handles the form submission process.
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default browser reload on submit.

        // Construct the contact object from state for the request body.
        const contact = {
            firstName: values.firstName || undefined,
            lastName: values.lastName || undefined,
            email: values.email || undefined,
            message: values.message || undefined
        };

        try {
            // Use the fetch API to send a POST request to the backend.
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
                // If submission is successful, set state to show the success message.
                console.log('Form submitted successfully.');
                setIsSubmitted(true);
            } else {
                // If the server returns an error, display it to the user.
                setValues({ ...values, error: data.error || 'Something went wrong.' });
            }
        } catch (err) {
            // Catch any network or unexpected errors during the fetch operation.
            console.error('Submission failed:', err);
            setValues({ ...values, error: 'Could not send message. Please try again later.' });
        }
    };

    return (
        <div className="page">
            <h1>Get in Touch</h1>

            {/* Conditionally render the success message or the form based on isSubmitted state */}
            {isSubmitted ? (
                <div className="info-card">
                    <h3>Thank You!</h3>
                    <p>Your message has been sent successfully. I'll get back to you shortly.</p>
                </div>
            ) : (
                <>
                    <p>Whether you’re looking to collaborate, discuss a project, or just say hi — feel free to reach out!</p>

                    <div className="info-card">
                        <p><strong>Email:</strong> akachur@my.centennialcollege.ca</p>
                        <p><strong>Phone:</strong> 647-510-5343</p>
                        <p><strong>Location:</strong> Toronto • Canada</p>
                    </div>

                    <form onSubmit={handleSubmit} aria-label="Contact form" className="form">
                        {/* Each form group uses a controlled component pattern with value and onChange */}
                        <div className="form-group">
                            <label htmlFor="firstName">First Name: </label>
                            <input type="text" id="firstName" name="firstName" required value={values.firstName} onChange={handleChange('firstName')} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name: </label>
                            <input type="text" id="lastName" name="lastName" required value={values.lastName} onChange={handleChange('lastName')} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address: </label>
                            <input type="email" id="email" name="email" required value={values.email} onChange={handleChange('email')} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message: </label>
                            <textarea id="message" name="message" required rows="4" value={values.message} onChange={handleChange('message')}></textarea>
                        </div>

                        {/* Conditionally render the error message if it exists in the state */}
                        {values.error && (<p className="error-message" style={{ color: 'red' }}>{values.error}</p>)}

                        <button type="submit">Send Message</button>
                    </form>
                </>
            )}
        </div>
    );
}