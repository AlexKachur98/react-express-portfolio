/**
 * @file contact.controller.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Controller function for creating new contact messages.
 */
import Contact from '../models/contact.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';

/**
 * @purpose Creates a new contact message document.
 * @route POST /api/contact
 * @access Public
 */
const create = async (req, res) => {
    // Create a new Contact document instance from the request body
    const contact = new Contact(req.body);
    try {
        // Save the new contact message to the database
        await contact.save();
        // Send a success response
        return res.status(200).json({ message: "Contact message received successfully!" });
    } catch (err) {
        // Handle validation or other save errors
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

// Note: Per Assignment 2, only a POST route is required for Contact.
// You could add list/read/delete controllers here if you wanted admin functionality.

export default { create };
