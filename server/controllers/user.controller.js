/**
 * @file user.controller.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Controller functions for all user-related logic (CRUD + Auth).
 */

import User from '../models/user.model.js';
import _ from 'lodash'; // Utility for merging objects
import errorHandler from '../helpers/dbErrorHandler.js';
import jwtUtil from '../utils/jwt.js';
import config from '../../config/config.js';

// --- Authentication Controllers ---

/**
 * @purpose Signs in a user after validating email and password.
 * @route POST /api/signin
 */
const signin = async (req, res) => {
    try {
        // Find the user by their email address
        let user = await User.findOne({ email: req.body.email });

        // If user not found, or password doesn't match, return 401
        if (!user || !user.authenticate(req.body.password)) {
            return res.status(401).json({ error: "Email and password do not match." });
        }

        // If authentication is successful, generate a JWT
        // The payload contains the user's ID
        const token = jwtUtil.generateToken({ _id: user._id });

        // Set the token in an HTTP-only cookie for web clients
        res.cookie('t', token, {
            httpOnly: true,
            secure: config.env === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        // Send the token and user details (without password/salt) in the response
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.error("[Auth Error] Signin failed:", err);
        return res.status(500).json({ error: "Could not sign in" });
    }
};

/**
 * @purpose Signs out a user by clearing the auth cookie.
 * @route GET /api/signout
 */
const signout = (req, res) => {
    // Clear the cookie named 't'
    res.clearCookie("t");
    return res.status(200).json({
        message: "Signed out successfully"
    });
};

// --- CRUD Controllers ---

/**
 * @purpose Creates a new user (Registration).
 * @route POST /api/users
 */
const create = async (req, res) => {
    const user = new User(req.body);
    try {
        // The password gets hashed automatically by the 'virtual' field in the model
        await user.save();
        return res.status(200).json({ message: "Successfully signed up!" });
    } catch (err) {
        // Handle errors (e.g., validation, duplicate email)
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Lists all users.
 * @route GET /api/users
 */
const list = async (req, res) => {
    try {
        // Find all users, selecting only non-sensitive fields
        let users = await User.find().select('name email updated created');
        res.json(users);
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
        // Use lodash 'extend' to merge properties from req.body onto the user object
        user = _.extend(user, req.body);

        // If password is being updated, the model's virtual setter will handle hashing
        if (req.body.password) {
            user.password = req.body.password;
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
        let user = req.profile;
        let deletedUser = await user.deleteOne(); // Mongoose v6+
        deletedUser.hashed_password = undefined; // Clear sensitive data
        deletedUser.salt = undefined;
        res.json(deletedUser);
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
            return res.status(403).json({ error: "Deleting all users is only allowed in development." });
        }
        await User.deleteMany({}); // Empty filter deletes all documents
        return res.status(200).json({
            message: "All users have been deleted."
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
    try {
        // Find a user document by its MongoDB ObjectId
        let user = await User.findById(id);
        if (!user) {
            // If no user is found, send a 400 error response
            return res.status(400).json({ error: "User not found" });
        }
        // Attach user object to the request for later use
        req.profile = user;
        next(); // Proceed to the next handler
    } catch (err) {
        return res.status(400).json({ error: "Could not retrieve user" });
    }
};


export default { create, userByID, read, list, remove, update, signin, signout, removeAll };
