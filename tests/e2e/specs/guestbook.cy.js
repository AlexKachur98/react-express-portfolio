/**
 * @file guestbook.cy.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose E2E tests for the guestbook page.
 */

describe('Guestbook Page', () => {
    beforeEach(() => {
        cy.visit('/guestbook');
    });

    it('should load the guestbook page', () => {
        cy.url().should('include', '/guestbook');
    });

    it('should display Guest Book heading', () => {
        cy.contains('Guest Book').should('be.visible');
    });

    it('should display back to portfolio button', () => {
        cy.contains('Back to Portfolio').should('be.visible');
    });

    it('should navigate back to portfolio when clicking back button', () => {
        cy.contains('Back to Portfolio').click();
        cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('should show sign in section for unauthenticated users', () => {
        // Unauthenticated users see the sign in form
        cy.contains('Sign in').should('exist');
    });

    it('should display the glass section styling', () => {
        cy.get('.section--glass').should('exist');
    });

    it('should display secret guest access message', () => {
        cy.contains('Secret guest access').should('be.visible');
    });

    it('should display sign in form for unauthenticated users', () => {
        cy.get('form').should('exist');
    });
});
