/**
 * @file project.controller.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Controller functions for handling all Project CRUD logic.
 * @refactored 2025-12-05 - Now uses crudFactory for standard CRUD operations
 */
import Project from '../models/project.model.js';
import { createCrudController } from '../helpers/crudFactory.js';

/**
 * Normalize tags array from various input formats.
 * @param {string|string[]} tagsInput - Tags as array or comma-separated string
 * @returns {string[]} Normalized array of tag strings
 */
const normalizeTags = (tagsInput) => {
    if (Array.isArray(tagsInput)) {
        return tagsInput.map((t) => t?.toString().trim()).filter(Boolean);
    }
    if (typeof tagsInput === 'string') {
        return tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);
    }
    return [];
};

/**
 * Build project payload with proper normalization.
 * @param {Object} body - Request body
 * @returns {Object} Normalized payload
 */
const buildProjectPayload = (body = {}) => ({
    title: typeof body.title === 'string' ? body.title.trim() : '',
    description: typeof body.description === 'string' ? body.description.trim() : '',
    tags: normalizeTags(body.tags),
    image: typeof body.image === 'string' ? body.image.trim() : '',
    github: typeof body.github === 'string' ? body.github.trim() : '',
    live: typeof body.live === 'string' ? body.live.trim() : ''
});

// Create controller using factory
const controller = createCrudController(Project, {
    entityName: 'Project',
    paramName: 'project',
    buildPayload: buildProjectPayload,
    selectFields: 'title description tags image github live createdAt',
    sortField: '-createdAt'
});

// Export with consistent naming for routes
export default {
    create: controller.create,
    list: controller.list,
    read: controller.read,
    update: controller.update,
    remove: controller.remove,
    removeAll: controller.removeAll,
    projectByID: controller.byId
};
