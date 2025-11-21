/**
 * @file contact.routes.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines API endpoints for Contact CRUD, applying auth middleware.
 */
import express from 'express';
import contactCtrl from '../controllers/contact.controller.js';
import { requireSignin, requireAdmin } from '../middlewares/auth.js';
import { contactLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

// Collection routes
router.route('/contacts')
    .get(requireSignin, requireAdmin, contactCtrl.list) // Admin protected: List all contacts
    .post(contactLimiter, contactCtrl.create) // Public with rate limit: Anyone can send a message
    .delete(requireSignin, requireAdmin, contactCtrl.removeAll); // Admin protected: Delete all contacts

// Document routes for a specific contact message
router.route('/contacts/:contactId')
    .get(requireSignin, requireAdmin, contactCtrl.read) // Admin protected
    .put(requireSignin, requireAdmin, contactCtrl.update) // Admin protected
    .delete(requireSignin, requireAdmin, contactCtrl.remove); // Admin protected

// Param middleware to find contact by ID
router.param('contactId', contactCtrl.contactByID);

export default router;
