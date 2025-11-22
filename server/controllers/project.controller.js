/**
 * @file project.controller.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Controller functions for handling all Project CRUD logic.
 */
import Project from '../models/project.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import config from '../../config/config.js';

/**
 * @purpose Create a new project.
 * @route POST /api/projects
 * @access Protected
 */
const normalizeTags = (tagsInput) => {
    if (Array.isArray(tagsInput)) {
        return tagsInput.map((t) => t?.toString().trim()).filter(Boolean);
    }
    if (typeof tagsInput === 'string') {
        return tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    }
    return [];
};

const buildProjectPayload = (body = {}) => ({
    title: typeof body.title === 'string' ? body.title.trim() : '',
    description: typeof body.description === 'string' ? body.description.trim() : '',
    tags: normalizeTags(body.tags),
    image: typeof body.image === 'string' ? body.image.trim() : '',
    github: typeof body.github === 'string' ? body.github.trim() : '',
    live: typeof body.live === 'string' ? body.live.trim() : ''
});

const create = async (req, res) => {
    const project = new Project(buildProjectPayload(req.body));
    try {
        await project.save();
        return res.status(200).json(project);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose List all projects.
 * @route GET /api/projects
 * @access Public
 */
const list = async (req, res) => {
    try {
        // Find all projects and sort them by creation date (newest first)
        let projects = await Project.find().sort('-createdAt');
        res.json(projects);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Read a single project's details.
 * @route GET /api/projects/:projectId
 * @access Public
 */
const read = (req, res) => {
    // The project object is attached by the projectByID middleware
    return res.json(req.project);
};

/**
 * @purpose Update a project.
 * @route PUT /api/projects/:projectId
 * @access Protected
 */
const update = async (req, res) => {
    try {
        const payload = buildProjectPayload(req.body);
        const project = req.project; // Get project from middleware
        project.title = payload.title || project.title;
        project.description = payload.description || project.description;
        project.tags = payload.tags.length ? payload.tags : project.tags;
        project.image = payload.image || project.image;
        project.github = payload.github || project.github;
        project.live = payload.live || project.live;
        await project.save();
        res.json(project); // Return updated project
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Delete a project.
 * @route DELETE /api/projects/:projectId
 * @access Protected
 */
const remove = async (req, res) => {
    try {
        const project = req.project;
        await project.deleteOne();
        res.json(project); // Return deleted project info
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

/**
 * @purpose Deletes ALL projects. (As required by Assignment 2 PDF)
 * @route DELETE /api/projects
 * @access Protected (Requires Signin)
 */
const removeAll = async (req, res) => {
    try {
        if (config.env !== 'development') {
            return res.status(403).json({ error: "Deleting all projects is only allowed in development." });
        }
        await Project.deleteMany({}); // Empty filter deletes all
        return res.status(200).json({
            message: "All projects have been deleted."
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};


/**
 * @purpose Param middleware for project routes. Finds project by ID.
 * @param {string} id - The project ID from the route parameter.
 */
const projectByID = async (req, res, next, id) => {
    try {
        let project = await Project.findById(id);
        if (!project) return res.status(400).json({ error: "Project not found" });
        req.project = project; // Attach project to the request
        next();
    } catch (_err) {
        return res.status(400).json({ error: "Could not retrieve project" });
    }
};

export default { create, projectByID, read, list, remove, update, removeAll };
