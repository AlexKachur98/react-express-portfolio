/**
 * @file gallery.controller.js
 * @purpose CRUD controllers for cat gallery images stored as base64 strings.
 */
import GalleryItem from '../models/galleryItem.model.js';
import _ from 'lodash';
import errorHandler from '../helpers/dbErrorHandler.js';

const create = async (req, res) => {
    const { title, imageData, tags } = req.body;
    if (!title || !imageData) {
        return res.status(400).json({ error: "Title and image data are required." });
    }

    const galleryItem = new GalleryItem({
        title,
        imageData,
        tags: tags || []
    });
    try {
        await galleryItem.save();
        return res.status(200).json(galleryItem);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const list = async (req, res) => {
    try {
        const { tag } = req.query;
        const filter = tag ? { tags: tag } : {};
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
        let galleryItem = req.galleryItem;
        galleryItem = _.extend(galleryItem, req.body);
        await galleryItem.save();
        return res.json(galleryItem);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const remove = async (req, res) => {
    try {
        const galleryItem = req.galleryItem;
        const deleted = await galleryItem.deleteOne();
        return res.json(deleted);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const removeAll = async (req, res) => {
    try {
        await GalleryItem.deleteMany({});
        return res.status(200).json({ message: "All gallery images have been deleted." });
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const galleryItemByID = async (req, res, next, id) => {
    try {
        const galleryItem = await GalleryItem.findById(id);
        if (!galleryItem) {
            return res.status(400).json({ error: "Gallery image not found" });
        }
        req.galleryItem = galleryItem;
        next();
    } catch (err) {
        return res.status(400).json({ error: "Could not retrieve gallery image" });
    }
};

export default { create, list, read, update, remove, removeAll, galleryItemByID };
