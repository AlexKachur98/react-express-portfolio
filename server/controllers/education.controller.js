/**
 * @file education.controller.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Controller functions for Education/Qualification CRUD logic.
 * @refactored 2025-12-05 - Now uses crudFactory for standard CRUD operations
 */
import Education from '../models/education.model.js';
import { createCrudController } from '../helpers/crudFactory.js';

/**
 * Normalize details array from various input formats.
 * @param {string|string[]} detailsInput - Details as array or newline-separated string
 * @returns {string[]} Normalized array of detail strings
 */
const normalizeDetails = (detailsInput) => {
    if (Array.isArray(detailsInput)) {
        return detailsInput.map((d) => d?.toString().trim()).filter(Boolean);
    }
    if (typeof detailsInput === 'string') {
        return detailsInput
            .split('\n')
            .map((d) => d.trim())
            .filter(Boolean);
    }
    return [];
};

/**
 * Build education payload with proper normalization.
 * @param {Object} body - Request body
 * @returns {Object} Normalized payload
 */
const buildEducationPayload = (body = {}) => ({
    program: typeof body.program === 'string' ? body.program.trim() : '',
    school: typeof body.school === 'string' ? body.school.trim() : '',
    period: typeof body.period === 'string' ? body.period.trim() : '',
    location: typeof body.location === 'string' ? body.location.trim() : '',
    details: normalizeDetails(body.details)
});

// Create controller using factory
const controller = createCrudController(Education, {
    entityName: 'Education entry',
    paramName: 'education',
    buildPayload: buildEducationPayload,
    selectFields: 'program school period location details createdAt',
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
    educationByID: controller.byId
};
