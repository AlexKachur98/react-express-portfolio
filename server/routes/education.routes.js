/**
 * @file education.routes.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Defines API endpoints for Education CRUD, applying auth middleware.
 * @refactored 2025-12-05 - Now uses routeFactory for standard CRUD routes
 */
import educationCtrl from '../controllers/education.controller.js';
import { createCrudRoutes } from '../helpers/routeFactory.js';

// Note: Uses 'qualifications' as path per Assignment 2 PDF requirements
export default createCrudRoutes(educationCtrl, {
    basePath: '/qualifications',
    paramName: 'educationId',
    byIdMethod: 'educationByID',
    publicRead: true,
    cacheSeconds: 60
});
