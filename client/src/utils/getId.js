/**
 * @file getId.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose Extracts a consistent identifier from objects that may use _id or id.
 *
 * MongoDB returns _id, but some APIs normalize to id. This utility handles both.
 */

/**
 * Extract identifier from an object, preferring _id over id
 * @param {Object} item - Object with _id or id property
 * @returns {string|undefined} The identifier or undefined if none found
 */
export const getId = (item) => item?._id ?? item?.id;
