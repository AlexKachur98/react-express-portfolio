/**
 * @file routeFactory.js
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Factory function to generate standard CRUD routes with authentication middleware.
 */
import express from 'express';
import { requireSignin, requireAdmin, requireDevOnly } from '../middlewares/auth.js';
import { publicCache } from '../middlewares/cache.js';

/**
 * Creates standard CRUD routes for a controller.
 * Routes are prefixed with basePath (e.g., '/projects').
 *
 * @param {Object} controller - Controller with CRUD methods
 * @param {Object} options - Route configuration
 * @param {string} options.basePath - Base path for routes (e.g., '/projects')
 * @param {string} options.paramName - Route parameter name (e.g., 'projectId')
 * @param {string} options.byIdMethod - Name of the byId method on controller (e.g., 'projectByID')
 * @param {boolean} [options.publicRead=true] - Whether list/read are public
 * @param {number} [options.cacheSeconds=60] - Cache duration for public GET requests
 * @param {boolean} [options.includeDeleteAll=true] - Whether to include DELETE all route
 * @returns {express.Router} Configured Express router
 */
export function createCrudRoutes(controller, options) {
    const {
        basePath,
        paramName,
        byIdMethod,
        publicRead = true,
        cacheSeconds = 60,
        includeDeleteAll = true
    } = options;

    const router = express.Router();

    // Handle param middleware for :id routes
    if (byIdMethod && controller[byIdMethod]) {
        router.param(paramName, controller[byIdMethod]);
    }

    // Collection routes
    const collectionRoute = router.route(basePath);

    // GET all - public (with cache) or admin only
    if (publicRead) {
        collectionRoute.get(publicCache(cacheSeconds), controller.list);
    } else {
        collectionRoute.get(requireSignin, requireAdmin, controller.list);
    }

    // POST create - admin only
    collectionRoute.post(requireSignin, requireAdmin, controller.create);

    // DELETE all - admin only, dev only
    if (includeDeleteAll && controller.removeAll) {
        collectionRoute.delete(requireSignin, requireAdmin, requireDevOnly, controller.removeAll);
    }

    // Document routes
    const documentRoute = router.route(`${basePath}/:${paramName}`);

    // GET single - public (with cache) or admin only
    if (publicRead) {
        documentRoute.get(publicCache(cacheSeconds), controller.read);
    } else {
        documentRoute.get(requireSignin, requireAdmin, controller.read);
    }

    // PUT update - admin only
    documentRoute.put(requireSignin, requireAdmin, controller.update);

    // DELETE single - admin only
    documentRoute.delete(requireSignin, requireAdmin, controller.remove);

    return router;
}

/**
 * Creates routes with custom middleware chain.
 *
 * @param {Object} routeConfig - Custom route definitions
 * @returns {express.Router} Configured Express router
 *
 * @example
 * createCustomRoutes({
 *   'GET /items': { middlewares: [publicCache(60)], handler: controller.list },
 *   'POST /items': { middlewares: [requireSignin, requireAdmin], handler: controller.create }
 * });
 */
export function createCustomRoutes(routeConfig) {
    const router = express.Router();

    for (const [route, config] of Object.entries(routeConfig)) {
        const [method, path] = route.split(' ');
        const { middlewares = [], handler } = config;

        router[method.toLowerCase()](path, ...middlewares, handler);
    }

    return router;
}

export default { createCrudRoutes, createCustomRoutes };
