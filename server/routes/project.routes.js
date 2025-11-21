/**
 * @file project.routes.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines API endpoints for Project CRUD, applying auth middleware.
 */
import express from 'express';
import projectCtrl from '../controllers/project.controller.js';
import { requireSignin, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Collection routes
router.route('/projects')
    .get(projectCtrl.list) // Public: Anyone can list projects
    .post(requireSignin, requireAdmin, projectCtrl.create) // Admin protected: create
    .delete(requireSignin, requireAdmin, projectCtrl.removeAll); // Admin protected: remove all projects

// Document routes (for a specific project)
router.route('/projects/:projectId')
    .get(projectCtrl.read) // Public: Anyone can read a single project
    .put(requireSignin, requireAdmin, projectCtrl.update) // Admin protected: update
    .delete(requireSignin, requireAdmin, projectCtrl.remove); // Admin protected: delete

// Param middleware to find project by ID
router.param('projectId', projectCtrl.projectByID);

export default router;
