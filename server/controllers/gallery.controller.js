/**
 * @file gallery.controller.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose CRUD controllers for cat gallery images stored as base64 strings.
 */
import mongoose from 'mongoose';
import GalleryItem from '../models/galleryItem.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';
import config from '../../config/config.js';
import { parsePaginationParams, paginatedQuery } from '../helpers/pagination.js';

const normalizeTags = (tagsInput) => {
    if (Array.isArray(tagsInput)) {
        return tagsInput.map((tag) => tag?.toString().trim()).filter(Boolean);
    }
    if (typeof tagsInput === 'string') {
        return tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    }
    return [];
};

const buildGalleryPayload = (body = {}) => ({
    title: typeof body.title === 'string' ? body.title.trim() : '',
    imageData: typeof body.imageData === 'string' ? body.imageData.trim() : '',
    tags: normalizeTags(body.tags)
});

const create = async (req, res) => {
    const payload = buildGalleryPayload(req.body);
    if (!payload.title || !payload.imageData) {
        return res.status(400).json({ error: "Title and image data are required." });
    }

    const galleryItem = new GalleryItem(payload);
    try {
        await galleryItem.save();
        return res.status(200).json(galleryItem);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const list = async (req, res) => {
    try {
        const { tag, page: pageParam, limit: limitParam } = req.query;
        const filter = tag ? { tags: tag } : {};

        // Support both paginated and non-paginated responses for backward compatibility
        // If page/limit provided, return paginated response; otherwise return array
        if (pageParam || limitParam) {
            const { page, limit } = parsePaginationParams(req.query);
            const result = await paginatedQuery(GalleryItem, filter, { page, limit, sort: '-createdAt' });
            return res.json(result);
        }

        // Default: return all items as array for backward compatibility with CatGallery
        const items = await GalleryItem.find(filter).sort('-createdAt');
        return res.json(items);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const read = (req, res) => {
    return res.json(req.galleryItem);
};

const update = async (req, res) => {
    try {
        const payload = buildGalleryPayload(req.body);
        const galleryItem = req.galleryItem;
        galleryItem.title = payload.title || galleryItem.title;
        galleryItem.imageData = payload.imageData || galleryItem.imageData;
        galleryItem.tags = payload.tags.length ? payload.tags : galleryItem.tags;
        await galleryItem.save();
        return res.json(galleryItem);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const remove = async (req, res) => {
    try {
        const galleryItem = req.galleryItem;
        await galleryItem.deleteOne();
        return res.json(galleryItem);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const removeAll = async (req, res) => {
    try {
        if (config.env !== 'development') {
            return res.status(403).json({ error: "Deleting all gallery images is only allowed in development." });
        }
        await GalleryItem.deleteMany({});
        return res.status(200).json({ message: "All gallery images have been deleted." });
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const galleryItemByID = async (req, res, next, id) => {
    // Validate ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid gallery item ID format" });
    }

    try {
        const galleryItem = await GalleryItem.findById(id);
        if (!galleryItem) {
            return res.status(400).json({ error: "Gallery image not found" });
        }
        req.galleryItem = galleryItem;
        next();
    } catch (err) {
        console.error('[galleryItemByID] Database error:', err.message);
        return res.status(400).json({ error: "Could not retrieve gallery image" });
    }
};

export default { create, list, read, update, remove, removeAll, galleryItemByID };
