/**
 * @file jwt.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Helper utility for creating JSON Web Tokens (JWT).
 */
import jwt from 'jsonwebtoken';
import config from '../../config/config.js'; // Import the secret key

/**
 * @purpose Generates a JWT signed with the application's secret key.
 * @param {object} payload - Data to include in the token (e.g., { _id: user._id }).
 * @returns {string} The generated JWT.
 */
const generateToken = (payload) => {
    // Sign the token using the payload, secret key, and an expiration time
    // as seen in 'AUTHENTICATION' slides.
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' }); // Expires in 1 hour
};

export { generateToken };
