/**
 * @file user.model.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines the Mongoose schema and model for the 'User' collection.
 * This file includes password hashing (using bcryptjs), a virtual password field,
 * and authentication methods, following the style from Week 6 materials.
 */
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    hashed_password: {
        type: String,
        required: "Password is required"
    },
    salt: String, // Stores the salt for this specific user
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

/**
 * @purpose Virtual field 'password' to handle password input from the client.
 * This field is not saved to the database. When set, it hashes the
 * password and stores it in 'hashed_password'.
 */
UserSchema
    .virtual('password')
    .set(function (password) {
        // Note: Using an arrow function here would break 'this' context
        this._password = password; // Store plain password temporarily
        this.salt = this.makeSalt(); // Generate a new salt
        this.hashed_password = this.encryptPassword(password); // Hash the password
    })
    .get(function () {
        return this._password;
    });

// Add custom methods to the UserSchema
UserSchema.methods = {
    /**
     * @purpose Authenticates a user by checking if the plain text password matches the hashed password.
     * @param {string} plainText - The plain text password to check.
     * @returns {boolean} - True if the password matches, false otherwise.
     */
    authenticate: function (plainText) {
        // Hash the incoming plain text password with the user's stored salt and compare
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * @purpose Encrypts (hashes) a password using bcryptjs and the user's salt.
     * @param {string} password - The plain text password to hash.
     * @returns {string} - The hashed password, or empty string on error.
     */
    encryptPassword: function (password) {
        if (!password || !this.salt) return '';
        try {
            // Use bcryptjs synchronous hashing, as seen in course examples
            return bcryptjs.hashSync(password, this.salt);
        } catch (err) {
            console.error("Password encryption failed:", err);
            return '';
        }
    },

    /**
     * @purpose Generates a salt for password hashing using bcryptjs.
     * @returns {string} - A random salt.
     */
    makeSalt: function () {
        // Generate a salt with 10 salt rounds
        return bcryptjs.genSaltSync(10);
    }
};

/**
 * @purpose Validation logic for the virtual 'password' field.
 * Ensures password is long enough and exists on creation.
 */
UserSchema.path('hashed_password').validate(function (_v) {
    if (this._password && this._password.length < 6) {
        this.invalidate('password', 'Password must be at least 6 characters.');
    }
    // Ensure password is provided when creating a new user
    if (this.isNew && !this._password) {
        this.invalidate('password', 'Password is required');
    }
}, null); // Error message is set by invalidate()

// Mongoose automatically creates a collection named 'users' (plural, lowercase)
export default mongoose.model('User', UserSchema);
