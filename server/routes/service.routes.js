/**
 * @file service.routes.js
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Defines API endpoints for Service CRUD, applying auth middleware.
 * @refactored 2025-12-05 - Now uses routeFactory for standard CRUD routes
 */
import serviceCtrl from '../controllers/service.controller.js';
import { createCrudRoutes } from '../helpers/routeFactory.js';

export default createCrudRoutes(serviceCtrl, {
    basePath: '/services',
    paramName: 'serviceId',
    byIdMethod: 'serviceByID',
    publicRead: true,
    cacheSeconds: 60
});
