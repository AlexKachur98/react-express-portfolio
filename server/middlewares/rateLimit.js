/**
 * @file rateLimit.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Centralized rate limiters for API endpoints.
 */
import rateLimit from 'express-rate-limit';

// Rate limit configuration constants
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const CONTACT_MAX_REQUESTS = 20; // Max contact form submissions per window
const AUTH_MAX_ATTEMPTS = 5; // Max login/signup attempts per window
const SESSION_MAX_REQUESTS = 60; // Max session validation requests per window

// Limit contact form submissions to mitigate spam
const contactLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: CONTACT_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).json({
            error: 'Too many contact form submissions. Please try again later.'
        });
    }
});

// Limit authentication attempts to prevent brute force attacks
const authLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: AUTH_MAX_ATTEMPTS,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful logins
    handler: (req, res) => {
        return res.status(429).json({
            error: 'Too many login attempts. Please try again later.'
        });
    }
});

// Limit session validation requests to prevent enumeration attacks
const sessionLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: SESSION_MAX_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return res.status(429).json({
            error: 'Too many session validation requests. Please try again later.'
        });
    }
});

export { contactLimiter, authLimiter, sessionLimiter };
