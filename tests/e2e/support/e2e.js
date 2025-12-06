/**
 * @file e2e.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose E2E test support file - runs before every test file.
 */

// Import commands
import './commands';

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
    // Prevent Cypress from failing tests on uncaught exceptions from the app
    // This is useful for third-party script errors (analytics, etc.)
    if (err.message.includes('ResizeObserver loop')) {
        return false;
    }
    // Let other errors fail the test
    return true;
});

// Clear cookies and local storage before each test
beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
});
