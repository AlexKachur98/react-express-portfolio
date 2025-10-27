/**
 * @file project.routes.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines API endpoints for Project CRUD, applying auth middleware.
 */
import express from 'express';
import projectCtrl from '../controllers/project.controller.js';
import { requireSignin } from '../middlewares/auth.js';

const router = express.Router();

// Collection routes
router.route('/projects')
    .get(projectCtrl.list) // Public: Anyone can list projects
    .post(requireSignin, projectCtrl.create) // Protected: Only signed-in users can create
    .delete(requireSignin, projectCtrl.removeAll); // Protected: remove all projects

// Document routes (for a specific project)
router.route('/projects/:projectId')
    .get(projectCtrl.read) // Public: Anyone can read a single project
    .put(requireSignin, projectCtrl.update) // Protected: Only signed-in users can update
    .delete(requireSignin, projectCtrl.remove); // Protected: Only signed-in users can delete

// Param middleware to find project by ID
router.param('projectId', projectCtrl.projectByID);

export default router;