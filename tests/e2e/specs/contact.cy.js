/**
 * @file contact.cy.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose E2E tests for the contact section.
 */

describe('Contact Section', () => {
    beforeEach(() => {
        cy.visit('/');
        // Wait for page to load and scroll to trigger intersection observer
        cy.wait(500);
    });

    it('should have the contact section in the DOM', () => {
        cy.get('#contact').should('exist');
    });

    it('should display the contact form', () => {
        cy.get('.contact-form').should('exist');
    });

    it('should have firstName input field', () => {
        cy.get('input[name="firstName"]').should('exist');
    });

    it('should have lastName input field', () => {
        cy.get('input[name="lastName"]').should('exist');
    });

    it('should have email input field', () => {
        cy.get('input[name="email"]').should('exist');
    });

    it('should have message textarea', () => {
        cy.get('textarea[name="message"]').should('exist');
    });

    it('should have submit button', () => {
        cy.get('.contact-form__submit').should('exist');
    });

    it('should allow typing in firstName field', () => {
        cy.get('input[name="firstName"]').type('John', { force: true });
        cy.get('input[name="firstName"]').should('have.value', 'John');
    });

    it('should allow typing in lastName field', () => {
        cy.get('input[name="lastName"]').type('Doe', { force: true });
        cy.get('input[name="lastName"]').should('have.value', 'Doe');
    });

    it('should allow typing in email field', () => {
        cy.get('input[name="email"]').type('john@example.com', { force: true });
        cy.get('input[name="email"]').should('have.value', 'john@example.com');
    });

    it('should allow typing in message field', () => {
        cy.get('textarea[name="message"]').type('Hello there!', { force: true });
        cy.get('textarea[name="message"]').should('have.value', 'Hello there!');
    });
});
