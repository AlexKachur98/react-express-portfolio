/**
 * @file service.controller.js
 * @purpose Controller functions for Service CRUD logic.
 */
import Service from '../models/service.model.js';
import errorHandler from '../helpers/dbErrorHandler.js';

const buildServicePayload = (body = {}) => ({
    title: typeof body.title === 'string' ? body.title.trim() : '',
    description: typeof body.description === 'string' ? body.description.trim() : '',
    highlight: typeof body.highlight === 'boolean'
        ? body.highlight
        : typeof body.highlight === 'string'
            ? ['true', '1', 'yes', 'on'].includes(body.highlight.toLowerCase())
            : undefined,
    icon: typeof body.icon === 'string' ? body.icon.trim() : '',
    iconLabel: typeof body.iconLabel === 'string' ? body.iconLabel.trim() : ''
});

const create = async (req, res) => {
    const payload = buildServicePayload(req.body);
    const service = new Service({
        title: payload.title,
        description: payload.description,
        highlight: payload.highlight ?? false,
        icon: payload.icon,
        iconLabel: payload.iconLabel
    });
    try {
        await service.save();
        return res.status(200).json(service);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const list = async (req, res) => {
    try {
        const services = await Service.find().sort('-createdAt');
        return res.json(services);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const read = (req, res) => {
    return res.json(req.service);
};

const update = async (req, res) => {
    try {
        const payload = buildServicePayload(req.body);
        const service = req.service;
        service.title = payload.title || service.title;
        service.description = payload.description || service.description;
        if (payload.highlight !== undefined) {
            service.highlight = payload.highlight;
        }
        service.icon = payload.icon || service.icon;
        service.iconLabel = payload.iconLabel || service.iconLabel;
        await service.save();
        return res.json(service);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const remove = async (req, res) => {
    try {
        const service = req.service;
        const deleted = await service.deleteOne();
        return res.json(deleted);
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const removeAll = async (req, res) => {
    try {
        await Service.deleteMany({});
        return res.status(200).json({ message: "All services have been deleted." });
    } catch (err) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
};

const serviceByID = async (req, res, next, id) => {
    try {
        const service = await Service.findById(id);
        if (!service) {
            return res.status(400).json({ error: "Service not found" });
        }
        req.service = service;
        next();
    } catch (err) {
        return res.status(400).json({ error: "Could not retrieve service" });
    }
};

export default { create, list, read, update, remove, removeAll, serviceByID };
