/**
 * @file service.controller.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Controller functions for Service CRUD logic.
 * @refactored 2025-12-05 - Now uses crudFactory for standard CRUD operations
 */
import Service from '../models/service.model.js';
import { createCrudController } from '../helpers/crudFactory.js';

/**
 * Build service payload with proper type coercion.
 * @param {Object} body - Request body
 * @returns {Object} Normalized payload
 */
const buildServicePayload = (body = {}) => ({
    title: typeof body.title === 'string' ? body.title.trim() : '',
    description: typeof body.description === 'string' ? body.description.trim() : '',
    highlight:
        typeof body.highlight === 'boolean'
            ? body.highlight
            : typeof body.highlight === 'string'
              ? ['true', '1', 'yes', 'on'].includes(body.highlight.toLowerCase())
              : false,
    icon: typeof body.icon === 'string' ? body.icon.trim() : '',
    iconLabel: typeof body.iconLabel === 'string' ? body.iconLabel.trim() : ''
});

// Create controller using factory
const controller = createCrudController(Service, {
    entityName: 'Service',
    paramName: 'service',
    buildPayload: buildServicePayload,
    selectFields: 'title description highlight icon iconLabel createdAt',
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
    serviceByID: controller.byId
};
