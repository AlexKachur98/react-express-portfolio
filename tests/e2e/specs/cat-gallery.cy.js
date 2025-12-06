/**
 * @file cat-gallery.cy.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose E2E tests for the cat gallery page.
 */

describe('Cat Gallery Page', () => {
    beforeEach(() => {
        // The route is /cats not /cat-gallery
        cy.visit('/cats');
        // Wait for intro animation to complete (2.6 seconds)
        cy.wait(3000);
    });

    it('should load the cat gallery page', () => {
        cy.url().should('include', '/cats');
    });

    it('should display the cat gallery container', () => {
        cy.get('.cat-gallery').should('exist');
    });

    it('should display Cat Gallery eyebrow', () => {
        cy.get('.cat-gallery__eyebrow').should('contain', 'Cat Gallery');
    });

    it('should display the gallery title', () => {
        cy.get('.cat-gallery__title').should('contain', 'Meet the fluffy roommates');
    });

    it('should display All photos and Favourites buttons', () => {
        cy.contains('All photos').should('be.visible');
        cy.contains('Favourites').should('be.visible');
    });

    it('should display filter buttons', () => {
        cy.contains('All cats').should('be.visible');
        cy.contains('Simba').should('be.visible');
        cy.contains('Moura').should('be.visible');
    });

    it('should have carousel navigation buttons', () => {
        cy.get('.cat-gallery__scroll--left').should('exist');
        cy.get('.cat-gallery__scroll--right').should('exist');
    });

    it('should be able to click filter buttons', () => {
        cy.contains('Simba').click();
        cy.get('.cat-gallery__filter--active').should('contain', 'Simba');
    });
});
