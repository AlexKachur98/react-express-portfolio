/**
 * @file auth.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Authentication and authorization middleware functions using JWT.
 *
 * TODO: [TypeScript Migration] Convert this file to TypeScript for full type safety.
 * Priority: HIGH - Security-critical middleware handling authentication.
 *
 * @typedef {Object} AuthPayload
 * @property {string} _id - User ID
 * @property {string} email - User email
 * @property {boolean} isAdmin - Admin flag
 * @property {'admin'|'user'} [role] - User role
 */
import { expressjwt } from 'express-jwt';
import config from '../../config/config.js';

/**
 * @purpose Middleware that verifies the JWT token.
 * It checks for an 'Authorization: Bearer <token>' header.
 * If valid, attaches the decoded payload to req.auth.
 */
const requireSignin = expressjwt({
    secret: config.jwtSecret, // The same secret used to sign the tokens
    algorithms: ['HS256'], // Algorithm used to sign the token
    requestProperty: 'auth', // Keep decoded payload on req.auth
    getToken: (req) => {
        if (req.cookies && req.cookies.t) {
            // Prefer HTTP-only cookie
            return req.cookies.t;
        }
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        }
        return null;
    }
});

/**
 * @purpose Middleware that checks if the authenticated user has authorization.
 * This ensures the user in the token matches the user profile being accessed.
 * @assumes `requireSignin` has run.
 * @assumes `userByID` (param middleware) has run and attached user to `req.profile`.
 */
const hasAuthorization = (req, res, next) => {
    // Allow if the authenticated user owns the profile or has admin role.
    const isOwner = req.profile && req.auth && req.profile._id.toString() === req.auth._id;
    const isAdmin = req.auth && req.auth.role === 'admin';

    if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: 'User is not authorized' });
    }
    next();
};

/**
 * @purpose Middleware to ensure the authenticated user has admin role.
 * @assumes `requireSignin` has already populated req.auth
 */
const requireAdmin = (req, res, next) => {
    if (!req.auth || req.auth.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    return next();
};

/**
 * @purpose Middleware to block routes in production (defense in depth for delete-all endpoints).
 * This provides a route-level check in addition to controller-level NODE_ENV checks.
 */
const requireDevOnly = (req, res, next) => {
    if (config.env === 'production') {
        return res.status(403).json({ error: 'This operation is not allowed in production' });
    }
    return next();
};

// Alias for backward compatibility
const isAdmin = requireAdmin;

export { requireSignin, hasAuthorization, requireAdmin, requireDevOnly, isAdmin };
