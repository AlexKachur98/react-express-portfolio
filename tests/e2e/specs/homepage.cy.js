/**
 * @file homepage.cy.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose E2E tests for the portfolio homepage.
 */

describe('Portfolio Homepage', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('should load the homepage successfully', () => {
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should display the hero section with id="home"', () => {
        cy.get('#home').should('exist');
        cy.get('.hero').should('exist');
    });

    it('should display the welcome tag button', () => {
        cy.get('.hero__tag').should('be.visible');
        cy.get('.hero__tag').should('contain', 'Welcome');
    });

    it('should display the hero title', () => {
        cy.get('.hero__title').should('be.visible');
        cy.get('.hero__title').should('contain', 'I build thoughtful digital experiences');
    });

    it('should display the hero subtitle', () => {
        cy.get('.hero__subtitle').should('be.visible');
    });

    it('should display View Projects and Let\'s Talk buttons', () => {
        cy.get('.hero__actions').should('be.visible');
        cy.contains('View Projects').should('be.visible');
        cy.contains("Let's Talk").should('be.visible');
    });

    it('should display the contact section', () => {
        cy.get('#contact').should('exist');
    });

    it('should display the projects section', () => {
        cy.get('#projects').should('exist');
    });

    it('should display the footer', () => {
        cy.get('.footer').should('exist');
        cy.get('.footer').should('contain', 'Alex Kachur');
    });

    it('should be responsive on mobile', () => {
        cy.viewport('iphone-x');
        cy.get('.hero').should('be.visible');
        cy.get('.hero__title').should('be.visible');
    });

    it('should be responsive on tablet', () => {
        cy.viewport('ipad-2');
        cy.get('.hero').should('be.visible');
        cy.get('.hero__title').should('be.visible');
    });
});
