/**
 * @file config.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Centralized configuration file. Loads environment variables from .env.
 *
 * Required Environment Variables (Production):
 * - MONGO_URI: MongoDB connection string
 * - JWT_SECRET: Secret key for JWT signing (min 32 characters recommended)
 * - CLIENT_ORIGINS: Comma-separated list of allowed CORS origins
 *
 * Optional Environment Variables:
 * - PORT: Server port (default: 3000)
 * - NODE_ENV: Environment (development/production)
 * - COOKIE_SECURE: Force secure cookies (default: true in production)
 */

import 'dotenv/config';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Parse comma-separated list from environment variable
 * @param {string|undefined} value
 * @returns {string[]}
 */
const parseList = (value) =>
    (value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

/**
 * Validate required environment variables
 * @param {Object} vars - Object with var names as keys and values
 * @param {string[]} required - Array of required variable names
 */
function validateRequiredVars(vars, required) {
    const missing = required.filter((name) => !vars[name]);
    return { valid: missing.length === 0, missing };
}

// =============================================================================
// Configuration
// =============================================================================

const env = process.env.NODE_ENV || 'development';
const port = parseInt(process.env.PORT, 10) || 3000;

const config = {
    env,
    port,
    jwtSecret: process.env.JWT_SECRET || 'DEFAULT_SECRET_CHANGE_ME',
    mongoUri:
        process.env.MONGO_URI ||
        `mongodb://${process.env.IP || 'localhost'}:${process.env.MONGO_PORT || '27017'}/MyPortfolioDB`,
    clientOrigins: parseList(process.env.CLIENT_ORIGINS || process.env.ALLOWED_ORIGINS).concat(
        env === 'development'
            ? ['http://localhost:5173', 'http://localhost:5174', `http://localhost:${port}`]
            : []
    ),
    enableSecureCookies: process.env.COOKIE_SECURE === 'true' || env === 'production'
};

// =============================================================================
// Environment Validation
// =============================================================================

// Development warnings
if (env === 'development') {
    if (config.jwtSecret === 'DEFAULT_SECRET_CHANGE_ME') {
        console.warn(
            '[Config] WARNING: JWT_SECRET is not set. Please set a strong secret in your .env file.'
        );
    }
}

// Production validation (strict)
if (env === 'production') {
    const requiredVars = {
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET:
            process.env.JWT_SECRET && process.env.JWT_SECRET !== 'DEFAULT_SECRET_CHANGE_ME'
                ? process.env.JWT_SECRET
                : null,
        CLIENT_ORIGINS: config.clientOrigins.length > 0 ? 'set' : null
    };

    const validation = validateRequiredVars(requiredVars, [
        'MONGO_URI',
        'JWT_SECRET',
        'CLIENT_ORIGINS'
    ]);

    if (!validation.valid) {
        console.error(
            `[Config] ERROR: Missing required environment variables: ${validation.missing.join(', ')}`
        );
        console.error('[Config] These variables are required in production:');
        console.error('  - MONGO_URI: MongoDB connection string');
        console.error('  - JWT_SECRET: Strong secret key for JWT signing');
        console.error('  - CLIENT_ORIGINS: Comma-separated allowed CORS origins');
        process.exit(1);
    }

    // Additional security checks
    if (config.jwtSecret.length < 32) {
        console.warn('[Config] WARNING: JWT_SECRET should be at least 32 characters for security.');
    }
}

export default config;
