/**
 * @file jest.config.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose Root Jest configuration for centralized test infrastructure.
 */

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export default {
    // Root directory for tests (points to project root)
    rootDir,

    // Module file extensions
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

    // Transform ESM
    transform: {
        '^.+\\.(js|jsx)$': ['babel-jest', { configFile: path.join(__dirname, 'babel.config.js') }]
    },

    // Coverage configuration
    collectCoverageFrom: [
        'client/src/**/*.{js,jsx}',
        'server/**/*.js',
        '!**/node_modules/**',
        '!**/vendor/**',
        '!**/*.d.ts'
    ],
    coverageDirectory: path.join(rootDir, 'coverage'),
    coverageReporters: ['text', 'lcov', 'html'],

    // Ignore patterns
    testPathIgnorePatterns: ['/node_modules/', '/client/node_modules/', '/dist/', '/client/dist/'],

    // Timeout for slow tests
    testTimeout: 30000,

    // Verbose output
    verbose: true,

    // Clear mocks between tests
    clearMocks: true,

    // Restore mocks automatically
    restoreMocks: true,

    // Projects for different test environments
    projects: [
        {
            displayName: 'server',
            rootDir,
            testEnvironment: 'node',
            testMatch: [path.join(rootDir, 'tests/unit/server/**/*.test.js')],
            transform: {
                '^.+\\.js$': ['babel-jest', { configFile: path.join(__dirname, 'babel.config.js') }]
            },
            moduleFileExtensions: ['js', 'json', 'node']
        },
        {
            displayName: 'client',
            rootDir,
            testEnvironment: 'jsdom',
            testMatch: [
                path.join(rootDir, 'tests/unit/client/**/*.test.js'),
                path.join(rootDir, 'tests/unit/client/**/*.test.jsx'),
                path.join(rootDir, 'tests/integration/**/*.test.js'),
                path.join(rootDir, 'tests/integration/**/*.test.jsx')
            ],
            setupFilesAfterEnv: [path.join(__dirname, 'setup.js')],
            transform: {
                '^.+\\.(js|jsx)$': [
                    'babel-jest',
                    { configFile: path.join(__dirname, 'babel.config.js') }
                ]
            },
            moduleNameMapper: {
                '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
                '^@/(.*)$': path.join(rootDir, 'client/src/$1')
            },
            moduleFileExtensions: ['js', 'jsx', 'json', 'node']
        }
    ]
};
