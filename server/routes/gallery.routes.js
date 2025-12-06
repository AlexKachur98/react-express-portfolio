/**
 * @file gallery.routes.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Defines API endpoints for Cat Gallery CRUD, applying auth middleware.
 * @refactored 2025-12-05 - Now uses routeFactory for standard CRUD routes
 */
import galleryCtrl from '../controllers/gallery.controller.js';
import { createCrudRoutes } from '../helpers/routeFactory.js';

export default createCrudRoutes(galleryCtrl, {
    basePath: '/gallery',
    paramName: 'galleryId',
    byIdMethod: 'galleryItemByID',
    publicRead: true,
    cacheSeconds: 60
});
