/**
 * @file gallery.controller.js
 * @purpose CRUD controllers for cat gallery images stored as base64 strings.
 */
import GalleryImage from '../models/gallery.model.js';
import _ from 'lodash';
import errorHandler from '../helpers/dbErrorHandler.js';

const create = async (req, res) => {
    const { title, alt, imageData } = req.body;
    if (!title || !alt || !imageData) {
        return res.status(400).json({ error: "Title, alt, and image data are required." });
    }

    const galleryImage = new GalleryImage(req.body);
    try {
        await galleryImage.save();
        return res.status(200).json(galleryImage);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const list = async (req, res) => {
    try {
        const images = await GalleryImage.find().sort('createdAt');
        return res.json(images);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const read = (req, res) => {
    return res.json(req.galleryImage);
};

const update = async (req, res) => {
    try {
        let galleryImage = req.galleryImage;
        galleryImage = _.extend(galleryImage, req.body);
        await galleryImage.save();
        return res.json(galleryImage);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const remove = async (req, res) => {
    try {
        const galleryImage = req.galleryImage;
        const deleted = await galleryImage.deleteOne();
        return res.json(deleted);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const removeAll = async (req, res) => {
    try {
        await GalleryImage.deleteMany({});
        return res.status(200).json({ message: "All gallery images have been deleted." });
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const galleryByID = async (req, res, next, id) => {
    try {
        const galleryImage = await GalleryImage.findById(id);
        if (!galleryImage) {
            return res.status(400).json({ error: "Gallery image not found" });
        }
        req.galleryImage = galleryImage;
        next();
    } catch (err) {
        return res.status(400).json({ error: "Could not retrieve gallery image" });
    }
};

export default { create, list, read, update, remove, removeAll, galleryByID };
