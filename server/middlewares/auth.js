/**
 * @file auth.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Authentication and authorization middleware functions using JWT.
 */
import { expressjwt } from 'express-jwt';
import config from '../../config/config.js';
import User from '../models/user.model.js';

/**
 * @purpose Middleware that verifies the JWT token.
 * It checks for an 'Authorization: Bearer <token>' header.
 * If valid, attaches the decoded payload to req.auth.
 */
const requireSignin = expressjwt({
    secret: config.jwtSecret,       // The same secret used to sign the tokens
    algorithms: ['HS256'],          // Algorithm used to sign the token
    requestProperty: 'auth',        // Attach the decoded payload to req.auth
    getToken: (req) => {
        if (req.cookies && req.cookies.t) {
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
    // req.profile is the user loaded from the URL parameter (e.g., /api/users/:userId)
    // req.auth is the user payload from the JWT token
    const authorized = req.profile && req.auth && req.profile._id.toString() === req.auth._id;

    if (!authorized) {
        return res.status(403).json({
            error: "User is not authorized"
        });
    }
    // If IDs match, user is authorized, proceed
    next();
};

/**
 * @purpose Middleware to ensure the authenticated user has admin role.
 * @assumes `requireSignin` has already populated req.auth._id
 */
const requireAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.auth?._id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: "Admin role required" });
        }
        req.authUser = user;
        return next();
    } catch (err) {
        return res.status(403).json({ error: "Admin role required" });
    }
};

export { requireSignin, hasAuthorization, requireAdmin };
