/**
 * @file csrf.js
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose CSRF protection using double-submit cookie pattern.
 */
import crypto from 'crypto';
import config from '../../config/config.js';

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Generates a cryptographically secure CSRF token
 */
const generateToken = () => crypto.randomBytes(32).toString('hex');

/**
 * Middleware to set CSRF token cookie on GET requests
 * This token should be read by the client and sent back in the header
 */
const csrfTokenSetter = (req, res, next) => {
    // Only set token on GET requests (safe methods)
    if (req.method === 'GET') {
        // Check if token already exists
        if (!req.cookies[CSRF_COOKIE_NAME]) {
            const token = generateToken();
            const useSecureCookies = config.enableSecureCookies;

            res.cookie(CSRF_COOKIE_NAME, token, {
                httpOnly: false, // Must be readable by JavaScript
                secure: useSecureCookies,
                sameSite: useSecureCookies ? 'none' : 'lax',
                maxAge: 60 * 60 * 1000 // 1 hour
            });
        }
    }
    next();
};

/**
 * Middleware to validate CSRF token on state-changing requests
 * Skips validation for safe methods (GET, HEAD, OPTIONS)
 */
const csrfValidator = (req, res, next) => {
    // Skip for safe HTTP methods
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
        return next();
    }

    const cookieToken = req.cookies[CSRF_COOKIE_NAME];
    const headerToken = req.get(CSRF_HEADER_NAME);

    // Both must be present and match
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return res.status(403).json({ error: 'Invalid or missing CSRF token' });
    }

    next();
};

export { csrfTokenSetter, csrfValidator, CSRF_COOKIE_NAME, CSRF_HEADER_NAME };
