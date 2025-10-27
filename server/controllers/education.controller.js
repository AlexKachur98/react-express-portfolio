/**
 * @file education.controller.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Controller functions for Education/Qualification CRUD logic.
 */
import Education from '../models/education.model.js';
import _ from 'lodash';
import errorHandler from '../helpers/dbErrorHandler.js';

// Create new education entry
const create = async (req, res) => {
    const education = new Education(req.body);
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
        let educationList = await Education.find().sort('-startDate'); // Sort by start date
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
        let education = req.education;
        education = _.extend(education, req.body);
        await education.save();
        res.json(education);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

// Remove an education entry
const remove = async (req, res) => {
    try {
        let education = req.education;
        let deletedEducation = await education.deleteOne();
        res.json(deletedEducation);
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
    } catch (err) {
        return res.status(400).json({ error: "Could not retrieve education entry" });
    }
};

export default { create, educationByID, read, list, remove, update, removeAll };
