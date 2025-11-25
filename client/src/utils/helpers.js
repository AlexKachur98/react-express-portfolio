/**
 * @file helpers.js
 * @author Alex Kachur
 * @since 2025-11-25
 * @purpose Shared utility functions for the client application.
 */

/**
 * Formats a date string or Date object to a locale-friendly string
 * @param {string|Date} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string or empty string if invalid
 */
export const formatDate = (date, options = {}) => {
    if (!date) return '';
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return '';

        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            ...options
        };

        return dateObj.toLocaleString(undefined, defaultOptions);
    } catch {
        return '';
    }
};

/**
 * Formats a date to a relative time string (e.g., "2 hours ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
    if (!date) return '';
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return '';

        const now = new Date();
        const diffMs = now - dateObj;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) return 'just now';
        if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
        if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
        if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;

        return formatDate(dateObj, { hour: undefined, minute: undefined });
    } catch {
        return '';
    }
};

/**
 * Extracts items from a potentially paginated API response
 * @param {Array|object} response - API response (array or { items, pagination })
 * @returns {{ items: Array, pagination: object|null }}
 */
export const extractPaginatedData = (response) => {
    if (!response) return { items: [], pagination: null };

    // Handle paginated response format
    if (response.items && Array.isArray(response.items)) {
        return {
            items: response.items,
            pagination: response.pagination || null
        };
    }

    // Handle array response (backward compatibility)
    if (Array.isArray(response)) {
        return { items: response, pagination: null };
    }

    return { items: [], pagination: null };
};

/**
 * Filters items by tag
 * @param {Array} items - Array of items with tags property
 * @param {string} tag - Tag to filter by ('all' returns all items)
 * @returns {Array} Filtered items
 */
export const filterByTag = (items, tag) => {
    if (!Array.isArray(items)) return [];
    if (tag === 'all' || !tag) return items;
    return items.filter((item) => item.tags?.includes(tag));
};

/**
 * Debounces a function call
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (fn, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

/**
 * Truncates text to a specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncate = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength).trim() + '...';
};

/**
 * Generates a unique ID for client-side use
 * @returns {string} Unique ID
 */
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
