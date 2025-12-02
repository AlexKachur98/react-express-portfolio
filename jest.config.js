/**
 * @file jest.config.js
 * @purpose Jest configuration for backend tests
 */
export default {
    testEnvironment: 'node',
    testMatch: ['**/server/tests/**/*.test.js'],
    moduleFileExtensions: ['js', 'mjs'],
    transform: {},
    testTimeout: 10000,
    verbose: true
};
