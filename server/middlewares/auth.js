/**
 * @file auth.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Authentication and authorization middleware functions using JWT.
 */
import { expressjwt } from 'express-jwt';
import config from '../../config/config.js';

/**
 * @purpose Middleware that verifies the JWT token.
 * It checks for an 'Authorization: Bearer <token>' header.
 * If valid, attaches the decoded payload to req.auth.
 */
const requireSignin = expressjwt({
    secret: config.jwtSecret,      // The same secret used to sign the tokens
    algorithms: ['HS256'],       // Algorithm used to sign the token
    userProperty: 'auth'         // Attach the decoded payload to req.auth
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

export { requireSignin, hasAuthorization };
