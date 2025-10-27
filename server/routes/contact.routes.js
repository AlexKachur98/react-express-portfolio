/**
 * @file contact.routes.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines the public API endpoint for submitting contact messages.
 */
import express from 'express';
import contactCtrl from '../controllers/contact.controller.js';

const router = express.Router();

// Public route for anyone to send a contact message
router.route('/contact')
    .post(contactCtrl.create); // POST /api/contact

export default router;
