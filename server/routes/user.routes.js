/**
 * @file user.routes.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines API endpoints for user and authentication actions, applying middleware.
 */
import express from 'express';
import userCtrl from '../controllers/user.controller.js';
import { requireSignin, hasAuthorization, requireAdmin } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

// --- Public Authentication Routes ---
// These routes are used for logging in and logging out
// Rate limited to prevent brute force attacks
router.route('/signin').post(authLimiter, userCtrl.signin); // POST /api/signin
router.route('/signout').get(userCtrl.signout); // GET /api/signout
router.route('/auth/signin').post(authLimiter, userCtrl.signin); // Alias POST /api/auth/signin
router.route('/auth/signout').get(userCtrl.signout); // Alias GET /api/auth/signout

// --- User CRUD Routes ---
router.route('/users')
    .get(requireSignin, requireAdmin, userCtrl.list)     // GET /api/users (List all users - admin only)
    .post(userCtrl.create)  // POST /api/users (Register new user - public)
    // DELETE /api/users (Remove all users - protected)
    // As per Assignment 2 PDF, this route is required.
    .delete(requireSignin, requireAdmin, userCtrl.removeAll);

// --- Protected User Routes ---
// These routes handle operations for a specific user, identified by :userId
router.route('/users/:userId')
    // GET /api/users/:userId (Read a specific user's profile)
    // Protected: User must be signed in AND authorized to view their own profile
    .get(requireSignin, hasAuthorization, userCtrl.read)

    // PUT /api/users/:userId (Update a user's profile)
    // Protected: User must be signed in AND must be the correct user
    .put(requireSignin, hasAuthorization, userCtrl.update)

    // DELETE /api/users/:userId (Delete a user's profile)
    // Protected: User must be signed in AND must be the correct user
    .delete(requireSignin, hasAuthorization, userCtrl.remove);

// --- Param Middleware ---
// This middleware runs *first* for any route containing the ':userId' parameter
// It finds the user and attaches them to `req.profile`
router.param('userId', userCtrl.userByID);

export default router;
