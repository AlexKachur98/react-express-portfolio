/**
 * @file auth-pages.cy.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose E2E tests for authentication pages (Sign In and Sign Up).
 */

describe('Sign In Page', () => {
    beforeEach(() => {
        cy.visit('/signin');
    });

    it('should load the sign in page', () => {
        cy.url().should('include', '/signin');
    });

    it('should display Sign In heading', () => {
        cy.contains('Sign In').should('be.visible');
    });

    it('should display the sign in form', () => {
        cy.get('form.contact-form').should('exist');
    });

    it('should display email input field', () => {
        cy.get('input[type="email"]').should('be.visible');
    });

    it('should display password input field', () => {
        cy.get('input[type="password"]').should('be.visible');
    });

    it('should display submit button', () => {
        cy.get('button[type="submit"]').should('be.visible');
        cy.get('button[type="submit"]').should('contain', 'Sign In');
    });

    it('should have link to sign up page', () => {
        cy.contains('Sign up').should('have.attr', 'href', '/signup');
    });

    it('should allow typing in email field', () => {
        cy.get('input[type="email"]').type('test@example.com');
        cy.get('input[type="email"]').should('have.value', 'test@example.com');
    });

    it('should allow typing in password field', () => {
        cy.get('input[type="password"]').type('mypassword');
        cy.get('input[type="password"]').should('have.value', 'mypassword');
    });
});

describe('Sign Up Page', () => {
    beforeEach(() => {
        cy.visit('/signup');
    });

    it('should load the sign up page', () => {
        cy.url().should('include', '/signup');
    });

    it('should display Create Account heading', () => {
        cy.contains('Create Account').should('be.visible');
    });

    it('should display the sign up form', () => {
        cy.get('form.contact-form').should('exist');
    });

    it('should display name input field', () => {
        cy.get('input[type="text"]').should('be.visible');
    });

    it('should display email input field', () => {
        cy.get('input[type="email"]').should('be.visible');
    });

    it('should display password input field', () => {
        cy.get('input[type="password"]').should('be.visible');
    });

    it('should display submit button', () => {
        cy.get('button[type="submit"]').should('be.visible');
        cy.get('button[type="submit"]').should('contain', 'Sign Up');
    });

    it('should have link to sign in page', () => {
        cy.contains('Sign in').should('have.attr', 'href', '/signin');
    });

    it('should allow typing in all fields', () => {
        cy.get('input[type="text"]').type('Test User');
        cy.get('input[type="text"]').should('have.value', 'Test User');

        cy.get('input[type="email"]').type('test@example.com');
        cy.get('input[type="email"]').should('have.value', 'test@example.com');

        cy.get('input[type="password"]').type('password123');
        cy.get('input[type="password"]').should('have.value', 'password123');
    });
});
