/**
 * @file education.controller.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Controller functions for Education/Qualification CRUD logic.
 */
import Education from '../models/education.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import config from '../../config/config.js';

const normalizeDetails = (detailsInput) => {
    if (Array.isArray(detailsInput)) {
        return detailsInput.map((d) => d?.toString().trim()).filter(Boolean);
    }
    if (typeof detailsInput === 'string') {
        return detailsInput.split('\n').map((d) => d.trim()).filter(Boolean);
    }
    return [];
};

const buildEducationPayload = (body = {}) => ({
    program: typeof body.program === 'string' ? body.program.trim() : '',
    school: typeof body.school === 'string' ? body.school.trim() : '',
    period: typeof body.period === 'string' ? body.period.trim() : '',
    location: typeof body.location === 'string' ? body.location.trim() : '',
    details: normalizeDetails(body.details)
});

// Create new education entry
const create = async (req, res) => {
    const payload = buildEducationPayload(req.body);
    const education = new Education(payload);
    try {
        await education.save();
        return res.status(200).json(education);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

// List all education entries
const list = async (req, res) => {
    try {
        let educationList = await Education.find().sort('-createdAt'); // Newest first
        res.json(educationList);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

// Read a single education entry
const read = (req, res) => {
    return res.json(req.education); // Sent from educationByID
};

// Update an education entry
const update = async (req, res) => {
    try {
        const payload = buildEducationPayload(req.body);
        const education = req.education;
        education.program = payload.program || education.program;
        education.school = payload.school || education.school;
        education.period = payload.period || education.period;
        education.location = payload.location || education.location;
        education.details = payload.details.length ? payload.details : education.details;
        await education.save();
        res.json(education);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

// Remove an education entry
const remove = async (req, res) => {
    try {
        const education = req.education;
        await education.deleteOne();
        res.json(education);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Deletes ALL education entries. (As required by Assignment 2 PDF)
 * @route DELETE /api/qualifications
 * @access Protected (Requires Signin)
 */
const removeAll = async (req, res) => {
    try {
        if (config.env !== 'development') {
            return res.status(403).json({ error: "Deleting all education entries is only allowed in development." });
        }
        await Education.deleteMany({}); // Empty filter deletes all
        return res.status(200).json({
            message: "All education entries have been deleted."
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

// Param middleware to find education entry by ID
const educationByID = async (req, res, next, id) => {
    try {
        let education = await Education.findById(id);
        if (!education) return res.status(400).json({ error: "Education entry not found" });
        req.education = education; // Attach to request
        next();
    } catch (_err) {
        return res.status(400).json({ error: "Could not retrieve education entry" });
    }
};

export default { create, educationByID, read, list, remove, update, removeAll };
