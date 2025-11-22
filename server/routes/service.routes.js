/**
 * @file service.routes.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Defines API endpoints for Service CRUD, applying auth middleware.
 */
import express from 'express';
import serviceCtrl from '../controllers/service.controller.js';
import { requireSignin, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.route('/services')
    .get(serviceCtrl.list) // Public: list services
    .post(requireSignin, requireAdmin, serviceCtrl.create) // Admin: create
    .delete(requireSignin, requireAdmin, serviceCtrl.removeAll); // Admin: delete all

router.route('/services/:serviceId')
    .get(serviceCtrl.read) // Public: read single service
    .put(requireSignin, requireAdmin, serviceCtrl.update) // Admin: update
    .delete(requireSignin, requireAdmin, serviceCtrl.remove); // Admin: delete

router.param('serviceId', serviceCtrl.serviceByID);

export default router;
