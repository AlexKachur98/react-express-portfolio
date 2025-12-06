/**
 * @file gallery.controller.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose CRUD controllers for cat gallery images stored as base64 strings.
 * @refactored 2025-12-05 - Uses crudFactory with custom overrides for image validation
 */
import mongoose from 'mongoose';
import GalleryItem from '../models/galleryItem.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import { createExtendedController } from '../helpers/crudFactory.js';
import { parsePaginationParams, paginatedQuery } from '../helpers/pagination.js';

// Image validation constants
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Validates base64 image data for size and type.
 * @param {string} imageData - Base64 encoded image string
 * @returns {{ valid: boolean, error?: string }}
 */
const validateImageData = (imageData) => {
    if (!imageData || typeof imageData !== 'string') {
        return { valid: false, error: 'Image data is required.' };
    }

    const dataUrlMatch = imageData.match(/^data:([^;]+);base64,(.+)$/);
    if (!dataUrlMatch) {
        return { valid: false, error: 'Invalid image data format. Must be a base64 data URL.' };
    }

    const mimeType = dataUrlMatch[1];
    const base64Data = dataUrlMatch[2];

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return {
            valid: false,
            error: `Invalid image type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
        };
    }

    const approximateSize = Math.ceil((base64Data.length * 3) / 4);
    if (approximateSize > MAX_IMAGE_SIZE) {
        return {
            valid: false,
            error: `Image too large. Maximum size is ${MAX_IMAGE_SIZE / (1024 * 1024)}MB.`
        };
    }

    return { valid: true };
};

/**
 * Normalize tags array from various input formats.
 * @param {string|string[]} tagsInput - Tags as array or comma-separated string
 * @returns {string[]} Normalized array of tag strings
 */
const normalizeTags = (tagsInput) => {
    if (Array.isArray(tagsInput)) {
        return tagsInput.map((tag) => tag?.toString().trim()).filter(Boolean);
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
 * Build gallery payload with proper normalization.
 * @param {Object} body - Request body
 * @returns {Object} Normalized payload
 */
const buildGalleryPayload = (body = {}) => ({
    title: typeof body.title === 'string' ? body.title.trim() : '',
    imageData: typeof body.imageData === 'string' ? body.imageData.trim() : '',
    tags: normalizeTags(body.tags)
});

// Custom methods that override factory defaults
const customMethods = {
    /**
     * Create with image validation.
     * @route POST /api/gallery
     */
    create: async (req, res) => {
        const payload = buildGalleryPayload(req.body);
        if (!payload.title || !payload.imageData) {
            return res.status(400).json({ error: 'Title and image data are required.' });
        }

        const imageValidation = validateImageData(payload.imageData);
        if (!imageValidation.valid) {
            return res.status(400).json({ error: imageValidation.error });
        }

        try {
            const galleryItem = new GalleryItem(payload);
            await galleryItem.save();
            return res.status(201).json(galleryItem);
        } catch (err) {
            return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
        }
    },

    /**
     * List with optional pagination and tag filtering.
     * @route GET /api/gallery
     */
    list: async (req, res) => {
        try {
            const { tag, page: pageParam, limit: limitParam } = req.query;
            const filter = tag ? { tags: tag } : {};

            // Support both paginated and non-paginated responses
            if (pageParam || limitParam) {
                const { page, limit } = parsePaginationParams(req.query);
                const result = await paginatedQuery(GalleryItem, filter, {
                    page,
                    limit,
                    sort: '-createdAt',
                    select: 'title imageData tags createdAt'
                });
                return res.json(result);
            }

            // Default: return all items as array
            const items = await GalleryItem.find(filter)
                .select('title imageData tags createdAt')
                .sort('-createdAt');
            return res.json(items);
        } catch (err) {
            return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
        }
    },

    /**
     * Update with image validation.
     * @route PUT /api/gallery/:galleryItemId
     */
    update: async (req, res) => {
        try {
            const payload = buildGalleryPayload(req.body);
            const galleryItem = req.galleryItem;

            if (payload.imageData) {
                const imageValidation = validateImageData(payload.imageData);
                if (!imageValidation.valid) {
                    return res.status(400).json({ error: imageValidation.error });
                }
            }

            galleryItem.title = payload.title || galleryItem.title;
            galleryItem.imageData = payload.imageData || galleryItem.imageData;
            galleryItem.tags = payload.tags.length ? payload.tags : galleryItem.tags;
            await galleryItem.save();
            return res.json(galleryItem);
        } catch (err) {
            return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
        }
    },

    /**
     * Param middleware with ObjectId validation.
     * @param {string} id - Gallery item ID from route parameter
     */
    byId: async (req, res, next, id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid gallery item ID format' });
        }

        try {
            const galleryItem = await GalleryItem.findById(id);
            if (!galleryItem) {
                return res.status(404).json({ error: 'Gallery image not found' });
            }
            req.galleryItem = galleryItem;
            next();
        } catch (err) {
            console.error('[galleryItemByID] Database error:', err.message);
            return res.status(400).json({ error: 'Could not retrieve gallery image' });
        }
    }
};

// Create controller using factory with custom overrides
const controller = createExtendedController(
    GalleryItem,
    {
        entityName: 'Gallery image',
        paramName: 'galleryItem',
        buildPayload: buildGalleryPayload,
        selectFields: 'title imageData tags createdAt',
        sortField: '-createdAt'
    },
    customMethods
);

// Export with consistent naming for routes
export default {
    create: controller.create,
    list: controller.list,
    read: controller.read,
    update: controller.update,
    remove: controller.remove,
    removeAll: controller.removeAll,
    galleryItemByID: controller.byId
};
