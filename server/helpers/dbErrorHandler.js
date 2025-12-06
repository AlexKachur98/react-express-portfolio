/**
 * @file dbErrorHandler.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Provides helper functions to parse Mongoose/MongoDB errors into user-friendly messages.
 */

/**
 * @purpose Extracts the field name from a MongoDB unique constraint error (code 11000).
 * @param {Error} err - The MongoDB error object.
 * @returns {string} A user-friendly message (e.g., "Email already exists").
 */
const getUniqueErrorMessage = (err) => {
    let output;
    try {
        // Attempt to extract the field name using regex or string parsing
        // This looks for the text between 'index: ' and '_1'
        let fieldName =
            err.message.match(/index: (.*)_1/)[1] ||
            err.message.substring(err.message.lastIndexOf('.$') + 2, err.message.lastIndexOf('_1'));
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';
    } catch (_ex) {
        output = 'Unique field already exists';
    }
    return output;
};

/**
 * @purpose Parses Mongoose or MongoDB errors into a single, user-friendly message.
 * @param {Error} err - The error object.
 * @returns {string} A user-friendly error message.
 */
const getErrorMessage = (err) => {
    let message = '';

    // Handle MongoDB native driver error codes
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            default:
                message = 'Database error occurred.';
        }
    } else if (err.errors) {
        // Handle Mongoose validation errors
        for (let errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
                return message; // Return the first validation error found
            }
        }
        // Fallback if no specific message found in errors object
        if (!message) message = 'Validation error occurred.';
    } else if (err.message) {
        // Handle other generic errors
        message = err.message;
    } else {
        message = 'Unknown server error.'; // Fallback
    }
    return message;
};

export default { getErrorMessage };
