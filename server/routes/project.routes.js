/**
 * @file project.routes.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines API endpoints for Project CRUD, applying auth middleware.
 * @refactored 2025-12-05 - Now uses routeFactory for standard CRUD routes
 */
import projectCtrl from '../controllers/project.controller.js';
import { createCrudRoutes } from '../helpers/routeFactory.js';

export default createCrudRoutes(projectCtrl, {
    basePath: '/projects',
    paramName: 'projectId',
    byIdMethod: 'projectByID',
    publicRead: true,
    cacheSeconds: 60
});
