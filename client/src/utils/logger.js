/**
 * @file logger.js
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Centralized logging utility that can be configured for different environments.
 */

const isDev = import.meta.env.DEV;

/**
 * Logger utility for consistent error/debug handling.
 * In production, errors could be sent to a monitoring service.
 */
const logger = {
    error: (message, ...args) => {
        if (isDev) {
            console.error(message, ...args);
        }
        // In production, could send to error monitoring service (Sentry, etc.)
    },
    warn: (message, ...args) => {
        if (isDev) {
            console.warn(message, ...args);
        }
    },
    info: (message, ...args) => {
        if (isDev) {
            console.info(message, ...args);
        }
    },
    debug: (message, ...args) => {
        if (isDev) {
            console.debug(message, ...args);
        }
    }
};

export default logger;
