/**
 * @file gallery.routes.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Defines API endpoints for Cat Gallery CRUD, applying auth middleware.
 */
import express from 'express';
import galleryCtrl from '../controllers/gallery.controller.js';
import { requireSignin, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.route('/gallery')
    .get(galleryCtrl.list) // Public: list all gallery images
    .post(requireSignin, requireAdmin, galleryCtrl.create) // Admin: create
    .delete(requireSignin, requireAdmin, galleryCtrl.removeAll); // Admin: delete all

router.route('/gallery/:galleryId')
    .get(galleryCtrl.read) // Public: read single image
    .put(requireSignin, requireAdmin, galleryCtrl.update) // Admin: update
    .delete(requireSignin, requireAdmin, galleryCtrl.remove); // Admin: delete

router.param('galleryId', galleryCtrl.galleryItemByID);

export default router;
