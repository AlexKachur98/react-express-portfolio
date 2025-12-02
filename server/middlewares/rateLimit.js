/**
 * @file rateLimit.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Centralized rate limiters for API endpoints.
 */
import rateLimit from 'express-rate-limit';

// Limit contact form submissions to mitigate spam
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per IP per window
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
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful logins
    handler: (req, res) => {
        return res.status(429).json({
            error: 'Too many login attempts. Please try again later.'
        });
    }
});

export { contactLimiter, authLimiter };
