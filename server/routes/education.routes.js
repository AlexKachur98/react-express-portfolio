/**
 * @file education.routes.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines API endpoints for Education CRUD, applying auth middleware.
 */
import express from 'express';
import educationCtrl from '../controllers/education.controller.js';
import { requireSignin, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Collection routes (using 'qualifications' as in Assignment 2 PDF)
router.route('/qualifications')
    .get(educationCtrl.list) // Public: Anyone can list education entries
    .post(requireSignin, requireAdmin, educationCtrl.create) // Admin protected: create
    .delete(requireSignin, requireAdmin, educationCtrl.removeAll); // Admin protected: remove all

// Document routes
router.route('/qualifications/:educationId')
    .get(educationCtrl.read) // Public: Anyone can read a single entry
    .put(requireSignin, requireAdmin, educationCtrl.update) // Admin protected: update
    .delete(requireSignin, requireAdmin, educationCtrl.remove); // Admin protected: delete

// Param middleware
// Note: The param name 'educationId' must match the route param
router.param('educationId', educationCtrl.educationByID);

export default router;
