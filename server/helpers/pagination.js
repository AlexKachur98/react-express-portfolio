/**
 * @file pagination.js
 * @author Alex Kachur
 * @since 2025-11-25
 * @purpose Shared pagination utilities for consistent API responses.
 */

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parses pagination parameters from request query
 * @param {object} query - Express request query object
 * @returns {{ page: number, limit: number, skip: number }}
 */
const parsePaginationParams = (query = {}) => {
    const page = Math.max(1, parseInt(query.page, 10) || DEFAULT_PAGE);
    const requestedLimit = parseInt(query.limit, 10) || DEFAULT_LIMIT;
    const limit = Math.min(Math.max(1, requestedLimit), MAX_LIMIT);
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

/**
 * Creates a paginated response object
 * @param {Array} items - The items for the current page
 * @param {number} total - Total count of all items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {{ items: Array, pagination: { page, limit, total, pages, hasNext, hasPrev } }}
 */
const createPaginatedResponse = (items, total, page, limit) => ({
    items,
    pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
    }
});

/**
 * Executes a paginated query on a Mongoose model
 * @param {Model} Model - Mongoose model
 * @param {object} filter - Query filter
 * @param {object} options - Query options { page, limit, sort, populate, select }
 * @returns {Promise<{ items, pagination }>}
 */
const paginatedQuery = async (Model, filter = {}, options = {}) => {
    const {
        page = DEFAULT_PAGE,
        limit = DEFAULT_LIMIT,
        sort = '-createdAt',
        populate = null,
        select = null
    } = options;
    const skip = (page - 1) * limit;

    let query = Model.find(filter).sort(sort).skip(skip).limit(limit);

    if (select) {
        query = query.select(select);
    }

    if (populate) {
        query = query.populate(populate);
    }

    const [items, total] = await Promise.all([query.exec(), Model.countDocuments(filter)]);

    return createPaginatedResponse(items, total, page, limit);
};

export { parsePaginationParams, createPaginatedResponse, paginatedQuery, DEFAULT_LIMIT, MAX_LIMIT };
