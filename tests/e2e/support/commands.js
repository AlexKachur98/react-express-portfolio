/**
 * @file commands.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose Custom Cypress commands for E2E tests.
 */

/**
 * Login command - authenticates a user via the API with CSRF handling.
 * @param {string} email - User email
 * @param {string} password - User password
 */
Cypress.Commands.add('login', (email, password) => {
    // First, visit the signin page to get CSRF token cookie (cookie name is csrf_token with underscore)
    cy.visit('/signin');

    // Get CSRF token from cookie - note: underscore not hyphen
    cy.getCookie('csrf_token').then((cookie) => {
        const csrfToken = cookie ? cookie.value : '';

        cy.request({
            method: 'POST',
            url: '/api/signin',
            body: { email, password },
            headers: {
                'x-csrf-token': csrfToken
            },
            failOnStatusCode: false
        }).then((response) => {
            if (response.status === 200) {
                cy.log('Login successful');
            } else {
                cy.log('Login failed', response.body);
            }
        });
    });
});

/**
 * Login as admin command - uses fixture data.
 */
Cypress.Commands.add('loginAsAdmin', () => {
    cy.fixture('users').then((users) => {
        cy.login(users.admin.email, users.admin.password);
    });
});

/**
 * Login as regular user command - uses fixture data.
 */
Cypress.Commands.add('loginAsUser', () => {
    cy.fixture('users').then((users) => {
        cy.login(users.user.email, users.user.password);
    });
});

/**
 * Logout command - clears authentication.
 */
Cypress.Commands.add('logout', () => {
    cy.request({
        method: 'GET',
        url: '/api/signout',
        failOnStatusCode: false
    });
    cy.clearCookies();
});

/**
 * Check if element is visible and accessible.
 * @param {string} selector - CSS selector
 */
Cypress.Commands.add('shouldBeAccessible', (selector) => {
    cy.get(selector).should('be.visible').and('not.have.attr', 'aria-hidden', 'true');
});

/**
 * Fill and submit contact form.
 * @param {Object} data - Form data { firstName, lastName, email, message }
 */
Cypress.Commands.add('fillContactForm', (data) => {
    if (data.firstName) {
        cy.get('input[name="firstName"]').clear().type(data.firstName);
    }
    if (data.lastName) {
        cy.get('input[name="lastName"]').clear().type(data.lastName);
    }
    if (data.email) {
        cy.get('input[name="email"]').clear().type(data.email);
    }
    if (data.message) {
        cy.get('textarea[name="message"]').clear().type(data.message);
    }
});

/**
 * Wait for API response.
 * @param {string} alias - Request alias
 * @param {number} timeout - Timeout in ms
 */
Cypress.Commands.add('waitForApi', (alias, timeout = 10000) => {
    cy.wait(alias, { timeout });
});

/**
 * Get by data-testid attribute.
 * @param {string} testId - The data-testid value
 */
Cypress.Commands.add('getByTestId', (testId) => {
    return cy.get(`[data-testid="${testId}"]`);
});
