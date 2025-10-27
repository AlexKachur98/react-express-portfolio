/**
 * @file contact.routes.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines API endpoints for Contact CRUD, applying auth middleware.
 */
import express from 'express';
import contactCtrl from '../controllers/contact.controller.js';
import { requireSignin } from '../middlewares/auth.js';

const router = express.Router();

// Collection routes
router.route('/contacts')
    .get(requireSignin, contactCtrl.list) // Protected: List all contacts
    .post(contactCtrl.create) // Public: Anyone can send a message
    .delete(requireSignin, contactCtrl.removeAll); // Protected: Delete all contacts

// Document routes for a specific contact message
router.route('/contacts/:contactId')
    .get(requireSignin, contactCtrl.read) // Protected
    .put(requireSignin, contactCtrl.update) // Protected
    .delete(requireSignin, contactCtrl.remove); // Protected

// Param middleware to find contact by ID
router.param('contactId', contactCtrl.contactByID);

export default router;