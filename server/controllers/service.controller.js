/**
 * @file service.controller.js
 * @purpose Controller functions for Service CRUD logic.
 */
import Service from '../models/service.model.js';
import _ from 'lodash';
import errorHandler from '../helpers/dbErrorHandler.js';

const create = async (req, res) => {
    const service = new Service(req.body);
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
        let service = req.service;
        service = _.extend(service, req.body);
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
