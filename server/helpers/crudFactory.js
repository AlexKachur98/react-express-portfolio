/**
 * @file crudFactory.js
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Factory function to generate standard CRUD controller methods for Mongoose models.
 */
import errorHandler from './dbErrorHandler.js';
import config from '../../config/config.js';

/**
 * Creates standard CRUD controller methods for a Mongoose model.
 * Eliminates repetitive CRUD code across controllers.
 *
 * @param {import('mongoose').Model} Model - Mongoose model
 * @param {Object} options - Configuration options
 * @param {string} options.entityName - Display name for error messages (e.g., "Project")
 * @param {string} options.paramName - Request param key for byId middleware (e.g., "project")
 * @param {Function} [options.buildPayload] - Transform request body to model data
 * @param {string} [options.selectFields] - Fields to select in list queries
 * @param {string} [options.sortField='-createdAt'] - Sort field for list queries
 * @param {boolean} [options.allowDeleteAll=true] - Whether to allow deleteAll in dev mode
 * @returns {Object} Controller methods: create, list, read, update, remove, removeAll, byId
 */
export function createCrudController(Model, options) {
    const {
        entityName,
        paramName,
        buildPayload = (body) => body,
        selectFields = '',
        sortField = '-createdAt',
        allowDeleteAll = true
    } = options;

    /**
     * Create a new document.
     * @route POST /api/{resource}
     */
    const create = async (req, res) => {
        try {
            const payload = buildPayload(req.body);
            const doc = new Model(payload);
            await doc.save();
            return res.status(201).json(doc);
        } catch (err) {
            return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
        }
    };

    /**
     * List all documents.
     * @route GET /api/{resource}
     */
    const list = async (req, res) => {
        try {
            let query = Model.find();

            if (selectFields) {
                query = query.select(selectFields);
            }

            if (sortField) {
                query = query.sort(sortField);
            }

            const docs = await query;
            return res.json(docs);
        } catch (err) {
            return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
        }
    };

    /**
     * Read a single document (loaded by byId middleware).
     * @route GET /api/{resource}/:id
     */
    const read = (req, res) => {
        return res.json(req[paramName]);
    };

    /**
     * Update a document.
     * @route PUT /api/{resource}/:id
     */
    const update = async (req, res) => {
        try {
            const doc = req[paramName];
            const payload = buildPayload(req.body);

            // Update each field from payload
            Object.keys(payload).forEach((key) => {
                const value = payload[key];
                // Only update if value is provided (not undefined/null/empty for strings)
                if (value !== undefined && value !== null) {
                    // For arrays, only update if not empty
                    if (Array.isArray(value)) {
                        if (value.length > 0) {
                            doc[key] = value;
                        }
                    } else if (typeof value === 'string') {
                        // For strings, only update if not empty
                        if (value.trim() !== '') {
                            doc[key] = value;
                        }
                    } else {
                        doc[key] = value;
                    }
                }
            });

            await doc.save();
            return res.json(doc);
        } catch (err) {
            return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
        }
    };

    /**
     * Delete a single document.
     * @route DELETE /api/{resource}/:id
     */
    const remove = async (req, res) => {
        try {
            const doc = req[paramName];
            await doc.deleteOne();
            return res.json(doc);
        } catch (err) {
            return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
        }
    };

    /**
     * Delete all documents (development only).
     * @route DELETE /api/{resource}
     */
    const removeAll = async (req, res) => {
        try {
            if (!allowDeleteAll || config.env !== 'development') {
                return res.status(403).json({
                    error: `Deleting all ${entityName.toLowerCase()}s is only allowed in development.`
                });
            }

            await Model.deleteMany({});
            return res.json({ message: `All ${entityName.toLowerCase()}s have been deleted.` });
        } catch (err) {
            return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
        }
    };

    /**
     * Param middleware to load document by ID.
     * @param {string} id - Document ID from route parameter
     */
    const byId = async (req, res, next, id) => {
        try {
            const doc = await Model.findById(id);
            if (!doc) {
                return res.status(404).json({ error: `${entityName} not found` });
            }
            req[paramName] = doc;
            next();
        } catch (_err) {
            return res
                .status(400)
                .json({ error: `Could not retrieve ${entityName.toLowerCase()}` });
        }
    };

    return {
        create,
        list,
        read,
        update,
        remove,
        removeAll,
        byId
    };
}

/**
 * Creates a controller with additional custom methods.
 *
 * @param {import('mongoose').Model} Model - Mongoose model
 * @param {Object} options - Configuration options
 * @param {Object} [customMethods] - Additional methods to add to controller
 * @returns {Object} Controller with CRUD + custom methods
 */
export function createExtendedController(Model, options, customMethods = {}) {
    const baseController = createCrudController(Model, options);
    return { ...baseController, ...customMethods };
}

export default { createCrudController, createExtendedController };
