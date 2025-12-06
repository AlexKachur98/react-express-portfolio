/**
 * @file user.controller.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Controller functions for all user-related logic (CRUD + Auth).
 */
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import jwtUtil from '../utils/jwt.js';
import config from '../../config/config.js';
import { parsePaginationParams } from '../helpers/pagination.js';

const normalizeUserPayload = (body = {}) => ({
    name: typeof body.name === 'string' ? body.name.trim() : '',
    email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : '',
    password: typeof body.password === 'string' ? body.password : ''
});

// --- Authentication Controllers ---

/**
 * @purpose Signs in a user after validating email and password.
 * @route POST /api/signin
 */
const signin = async (req, res) => {
    try {
        const { email, password } = normalizeUserPayload(req.body);
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Find the user by their email address
        let user = await User.findOne({ email });

        // If user not found, or password doesn't match, return 401
        if (!user || !user.authenticate(password)) {
            return res.status(401).json({ error: 'Email and password do not match.' });
        }

        // If authentication is successful, generate a JWT with id + role
        const token = jwtUtil.generateToken({ _id: user._id, role: user.role });
        const useSecureCookies = config.enableSecureCookies;

        // Set the token in an HTTP-only cookie for web clients
        res.cookie('t', token, {
            httpOnly: true,
            // Enable secure in production once served over HTTPS
            secure: useSecureCookies,
            sameSite: useSecureCookies ? 'none' : 'lax',
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        // Send the token and user details (without password/salt) in the response
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('[Auth Error] Signin failed:', err);
        return res.status(500).json({ error: 'Could not sign in' });
    }
};

/**
 * @purpose Validates the current session and returns user info if valid.
 * @route GET /api/auth/session
 */
const session = async (req, res) => {
    try {
        // req.auth is set by requireSignin middleware if token is valid
        const userId = req.auth?._id;
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const user = await User.findById(userId).select('name email role');
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        return res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('[Auth Error] Session validation failed:', err);
        return res.status(401).json({ error: 'Session invalid' });
    }
};

/**
 * @purpose Signs out a user by clearing the auth cookie.
 * @route GET /api/signout
 */
const signout = (req, res) => {
    // Clear the cookie named 't'
    const useSecureCookies = config.enableSecureCookies;
    res.clearCookie('t', {
        httpOnly: true,
        secure: useSecureCookies,
        sameSite: useSecureCookies ? 'none' : 'lax'
    });
    return res.status(200).json({
        message: 'Signed out successfully'
    });
};

// --- CRUD Controllers ---

/**
 * @purpose Creates a new user (Registration).
 * @route POST /api/users
 */
const create = async (req, res) => {
    const payload = normalizeUserPayload(req.body);
    if (!payload.name || !payload.email || !payload.password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const user = new User({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: 'user'
    });
    try {
        // The password gets hashed automatically by the 'virtual' field in the model
        await user.save();
        return res.status(200).json({ message: 'Successfully signed up!' });
    } catch (err) {
        // Handle errors (e.g., validation, duplicate email)
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Lists all users with pagination.
 * @route GET /api/users?page=1&limit=20
 */
const list = async (req, res) => {
    try {
        const { page, limit } = parsePaginationParams(req.query);
        // Use custom query to select only non-sensitive fields
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find()
                .select('name email role createdAt updatedAt')
                .sort('-createdAt')
                .skip(skip)
                .limit(limit),
            User.countDocuments()
        ]);

        res.json({
            items: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Reads a single user's profile.
 * @route GET /api/users/:userId
 * @requires userByID middleware to attach user to req.profile
 */
const read = (req, res) => {
    // req.profile is attached by the userByID middleware
    req.profile.hashed_password = undefined; // Never send sensitive data
    req.profile.salt = undefined;
    return res.json(req.profile);
};

/**
 * @purpose Updates a user's profile.
 * @route PUT /api/users/:userId
 * @requires userByID middleware
 */
const update = async (req, res) => {
    try {
        let user = req.profile; // Get user from middleware
        const payload = normalizeUserPayload(req.body);
        if (payload.name) user.name = payload.name;
        if (payload.email) user.email = payload.email;

        // If password is being updated, the model's virtual setter will handle hashing
        if (payload.password) {
            user.password = payload.password;
        }

        await user.save();
        user.hashed_password = undefined; // Clean before sending response
        user.salt = undefined;
        res.json(user);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Deletes a user.
 * @route DELETE /api/users/:userId
 * @requires userByID middleware
 */
const remove = async (req, res) => {
    try {
        const user = req.profile;
        await user.deleteOne(); // Remove the document from the collection
        user.hashed_password = undefined; // Clear sensitive data
        user.salt = undefined;
        res.json(user);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Deletes ALL users. (As required by Assignment 2 PDF)
 * @route DELETE /api/users
 * @access Protected (Requires Signin)
 */
const removeAll = async (req, res) => {
    try {
        if (config.env !== 'development') {
            return res
                .status(403)
                .json({ error: 'Deleting all users is only allowed in development.' });
        }
        await User.deleteMany({}); // Empty filter deletes all documents
        return res.status(200).json({
            message: 'All users have been deleted.'
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

// --- Param Middleware ---

/**
 * @purpose Param middleware to find user by ID. Runs when ':userId' is in the route.
 * @param {string} id - The user ID from the route parameter.
 */
const userByID = async (req, res, next, id) => {
    // Validate ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID format' });
    }

    try {
        // Find a user document by its MongoDB ObjectId
        let user = await User.findById(id);
        if (!user) {
            // If no user is found, send a 400 error response
            return res.status(400).json({ error: 'User not found' });
        }
        // Attach user object to the request for later use
        req.profile = user;
        next(); // Proceed to the next handler
    } catch (err) {
        console.error('[userByID] Database error:', err.message);
        return res.status(400).json({ error: 'Could not retrieve user' });
    }
};

export default {
    create,
    userByID,
    read,
    list,
    remove,
    update,
    signin,
    signout,
    session,
    removeAll
};
