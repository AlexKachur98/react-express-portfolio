/**
 * @file setup.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose Global test setup with jest-dom matchers and common utilities.
 */

import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock localStorage for browser tests
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
}

// Mock fetch for API tests
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
    })
);

// Reset mocks between tests
beforeEach(() => {
    jest.clearAllMocks();
    if (typeof window !== 'undefined') {
        localStorageMock.clear();
    }
});

// Suppress console errors during tests (optional, can be removed)
// const originalError = console.error;
// beforeAll(() => {
//     console.error = (...args) => {
//         if (args[0]?.includes?.('Warning:')) return;
//         originalError.call(console, ...args);
//     };
// });
// afterAll(() => {
//     console.error = originalError;
// });
