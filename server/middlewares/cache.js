/**
 * @file cache.js
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Middleware for adding cache headers to public API responses.
 */

/**
 * @purpose Adds short-lived cache headers for public GET endpoints.
 * @param {number} maxAge - Cache duration in seconds (default: 60)
 */
const publicCache =
    (maxAge = 60) =>
    (req, res, next) => {
        // Only cache GET requests
        if (req.method === 'GET') {
            res.set('Cache-Control', `public, max-age=${maxAge}`);
        }
        next();
    };

export { publicCache };
