/**
 * @file cypress.config.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose Cypress E2E test configuration.
 */

import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        // Base URL for the app (Express serves built client)
        baseUrl: 'http://localhost:3000',

        // Test spec patterns
        specPattern: 'tests/e2e/specs/**/*.cy.{js,jsx,ts,tsx}',

        // Support file
        supportFile: 'tests/e2e/support/e2e.js',

        // Fixtures folder
        fixturesFolder: 'tests/e2e/fixtures',

        // Screenshots and videos
        screenshotsFolder: 'tests/e2e/screenshots',
        videosFolder: 'tests/e2e/videos',

        // Viewport settings
        viewportWidth: 1280,
        viewportHeight: 720,

        // Timeouts
        defaultCommandTimeout: 10000,
        requestTimeout: 10000,
        responseTimeout: 30000,

        // Retries
        retries: {
            runMode: 2,
            openMode: 0
        },

        // Video recording (disable in CI to save time)
        video: false,

        // Experimental features
        experimentalRunAllSpecs: true,

        setupNodeEvents(on, config) {
            // Implement node event listeners here
            return config;
        }
    },

    // Component testing (future)
    component: {
        devServer: {
            framework: 'react',
            bundler: 'vite'
        }
    }
});
