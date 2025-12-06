/**
 * @file sanitize.js
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Input sanitization middleware to prevent XSS and injection attacks.
 */

/**
 * Fields that should be skipped during sanitization (e.g., base64 image data).
 */
const SKIP_FIELDS = ['imageData', 'password'];

/**
 * Basic HTML entity encoding for string values.
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(str) {
    if (typeof str !== 'string') return str;

    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

/**
 * Recursively sanitizes an object's string values.
 * Skips fields in SKIP_FIELDS array.
 *
 * @param {Object} obj - Object to sanitize
 * @param {string[]} skipFields - Fields to skip
 * @returns {Object} Sanitized object
 */
function sanitizeObject(obj, skipFields = SKIP_FIELDS) {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map((item) => sanitizeObject(item, skipFields));
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (skipFields.includes(key)) {
            sanitized[key] = value;
        } else if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value, skipFields);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
}

/**
 * Express middleware to sanitize request body.
 * Protects against XSS by encoding HTML entities in string values.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function sanitizeBody(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    next();
}

/**
 * Express middleware to sanitize query parameters.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function sanitizeQuery(req, res, next) {
    if (req.query && typeof req.query === 'object') {
        req.query = sanitizeObject(req.query);
    }
    next();
}

/**
 * Combined sanitization middleware for body and query.
 */
export function sanitizeInput(req, res, next) {
    sanitizeBody(req, res, () => {
        sanitizeQuery(req, res, next);
    });
}

export default { sanitizeBody, sanitizeQuery, sanitizeInput, sanitizeString, sanitizeObject };
