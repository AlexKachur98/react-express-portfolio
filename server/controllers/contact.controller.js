/**
 * @file contact.controller.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Controller functions for Contact message CRUD logic.
 */
import mongoose from 'mongoose';
import Contact from '../models/contact.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import config from '../../config/config.js';
import { parsePaginationParams, paginatedQuery } from '../helpers/pagination.js';

const sanitizeContactPayload = (payload = {}) => ({
    firstName: typeof payload.firstName === 'string' ? payload.firstName.trim() : '',
    lastName: typeof payload.lastName === 'string' ? payload.lastName.trim() : '',
    email: typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '',
    message: typeof payload.message === 'string' ? payload.message.trim() : ''
});

/**
 * @purpose Creates a new contact message document.
 * @route POST /api/contact
 * @access Public
 */
const create = async (req, res) => {
    const payload = sanitizeContactPayload(req.body);
    if (!payload.firstName || !payload.lastName || !payload.email || !payload.message) {
        return res.status(400).json({ error: 'First name, last name, email, and message are required.' });
    }

    const contact = new Contact(payload);
    try {
        await contact.save();
        return res.status(200).json({ message: "Contact message received successfully!" });
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose List all contact messages with pagination.
 * @route GET /api/contacts?page=1&limit=20
 * @access Protected
 */
const list = async (req, res) => {
    try {
        const { page, limit } = parsePaginationParams(req.query);
        const result = await paginatedQuery(Contact, {}, { page, limit, sort: '-createdAt' });
        res.json(result);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Read a single contact message.
 * @route GET /api/contact/:contactId
 * @access Protected
 */
const read = (req, res) => {
    return res.json(req.contact);
};

/**
 * @purpose Update a contact message.
 * @route PUT /api/contact/:contactId
 * @access Protected
 */
const update = async (req, res) => {
    try {
        const payload = sanitizeContactPayload(req.body);
        const contact = req.contact;
        contact.firstName = payload.firstName || contact.firstName;
        contact.lastName = payload.lastName || contact.lastName;
        contact.email = payload.email || contact.email;
        contact.message = payload.message || contact.message;
        await contact.save();
        res.json(contact);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Delete a contact message.
 * @route DELETE /api/contact/:contactId
 * @access Protected
 */
const remove = async (req, res) => {
    try {
        const contact = req.contact;
        await contact.deleteOne();
        res.json(contact);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Deletes ALL contact messages.
 * @route DELETE /api/contact
 * @access Protected
 */
const removeAll = async (req, res) => {
    try {
        if (config.env !== 'development') {
            return res.status(403).json({ error: "Deleting all contacts is only allowed in development." });
        }
        await Contact.deleteMany({});
        return res.status(200).json({
            message: "All contacts have been deleted."
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

/**
 * @purpose Param middleware to find contact message by ID.
 * @param {string} id - The contact ID from the route parameter.
 */
const contactByID = async (req, res, next, id) => {
    // Validate ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid contact ID format" });
    }

    try {
        let contact = await Contact.findById(id);
        if (!contact) return res.status(400).json({ error: "Contact message not found" });
        req.contact = contact;
        next();
    } catch (err) {
        console.error('[contactByID] Database error:', err.message);
        return res.status(400).json({ error: "Could not retrieve contact message" });
    }
};

export default { create, list, read, update, remove, removeAll, contactByID };
