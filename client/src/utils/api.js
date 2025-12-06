/**
 * @file api.js
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose Centralized API client with CSRF protection, timeout handling, and type safety.
 *
 * TODO: [TypeScript Migration] Convert this file to TypeScript for full type safety.
 * Priority: HIGH - Security-critical code handling authentication and CSRF tokens.
 * See: client/src/types/api.d.ts for type definitions.
 *
 * @typedef {import('../types/api').ApiError} ApiError
 * @typedef {import('../types/api').User} User
 * @typedef {import('../types/api').SessionResponse} SessionResponse
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

/**
 * Reads the CSRF token from the cookie
 */
function getCsrfToken() {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.split('; ').find((row) => row.startsWith(`${CSRF_COOKIE_NAME}=`));
    return match ? match.split('=')[1] : null;
}

async function request(endpoint, options = {}) {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let response;

    // Create AbortController for request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);

    // Get CSRF token for state-changing requests
    const csrfToken = getCsrfToken();
    const csrfHeader = csrfToken ? { [CSRF_HEADER_NAME]: csrfToken } : {};

    try {
        response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
            credentials: 'include', // send cookies (httpOnly JWT)
            ...options,
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...csrfHeader,
                ...(options.headers || {})
            }
        });
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            return { error: 'Request timed out. Please try again.', status: 0 };
        }
        return { error: error?.message || 'Network request failed', status: 0 };
    }

    clearTimeout(timeoutId);

    let data;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const errorMessage = data?.error || response.statusText || 'Request failed';
        return { error: errorMessage, status: response.status };
    }

    return data ?? {};
}

/**
 * Executes a request with automatic retry for transient failures.
 * Uses exponential backoff between retries.
 *
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @param {number} [retryCount=0] - Current retry attempt
 * @returns {Promise<Object>} API response or error object
 */
async function requestWithRetry(endpoint, options = {}, retryCount = 0) {
    const result = await request(endpoint, options);

    // Don't retry if request succeeded
    if (!result.error) {
        return result;
    }

    // Check if we should retry
    const shouldRetry = RETRYABLE_STATUS_CODES.includes(result.status) || result.status === 0; // Network errors

    if (!shouldRetry || retryCount >= MAX_RETRIES) {
        return result;
    }

    // Exponential backoff: 1s, 2s, 4s
    const delay = RETRY_DELAY_MS * Math.pow(2, retryCount);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return requestWithRetry(endpoint, options, retryCount + 1);
}

// --- Auth ---
export async function signup(user) {
    return request('/users', { method: 'POST', body: JSON.stringify(user) });
}

export async function signin(credentials) {
    return request('/signin', { method: 'POST', body: JSON.stringify(credentials) });
}

export async function signout() {
    return request('/signout', { method: 'GET' });
}

export async function validateSession() {
    return requestWithRetry('/auth/session', { method: 'GET' });
}

// --- Contact (public + admin) ---
export async function postContact(contact) {
    return request('/contacts', { method: 'POST', body: JSON.stringify(contact) });
}

export async function getContacts() {
    return requestWithRetry('/contacts', { method: 'GET' });
}

export async function deleteContact(contactId) {
    return request(`/contacts/${contactId}`, { method: 'DELETE' });
}

export async function deleteAllContacts() {
    return request('/contacts', { method: 'DELETE' });
}

// --- Education / Qualifications ---
export async function getQualifications() {
    return requestWithRetry('/qualifications', { method: 'GET' });
}

export async function createQualification(data) {
    return request('/qualifications', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateQualification(educationId, data) {
    return request(`/qualifications/${educationId}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteQualification(educationId) {
    return request(`/qualifications/${educationId}`, { method: 'DELETE' });
}

export async function deleteAllQualifications() {
    return request('/qualifications', { method: 'DELETE' });
}

// --- Projects ---
export async function getProjects() {
    return requestWithRetry('/projects', { method: 'GET' });
}

export async function createProject(data) {
    return request('/projects', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateProject(projectId, data) {
    return request(`/projects/${projectId}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteProject(projectId) {
    return request(`/projects/${projectId}`, { method: 'DELETE' });
}

export async function deleteAllProjects() {
    return request('/projects', { method: 'DELETE' });
}

// --- Services ---
export async function getServices() {
    return requestWithRetry('/services', { method: 'GET' });
}

export async function createService(data) {
    return request('/services', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateService(serviceId, data) {
    return request(`/services/${serviceId}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteService(serviceId) {
    return request(`/services/${serviceId}`, { method: 'DELETE' });
}

export async function deleteAllServices() {
    return request('/services', { method: 'DELETE' });
}

// --- Gallery ---
export async function getGalleryItems() {
    return requestWithRetry('/gallery', { method: 'GET' });
}

// Temporary alias to avoid breaking existing imports (CatGallery/admin until updated)
export const getGallery = getGalleryItems;

export async function createGalleryItem(data) {
    return request('/gallery', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateGalleryItem(galleryId, data) {
    return request(`/gallery/${galleryId}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteGalleryItem(galleryId) {
    return request(`/gallery/${galleryId}`, { method: 'DELETE' });
}

export async function deleteAllGalleryItems() {
    return request('/gallery', { method: 'DELETE' });
}

// --- Guest Book (authenticated users) ---
export async function getGuestbookEntries() {
    return requestWithRetry('/guestbook', { method: 'GET' });
}

export async function signGuestbook(entry) {
    return request('/guestbook', { method: 'POST', body: JSON.stringify(entry) });
}

export async function deleteMyGuestbookEntry() {
    return request('/guestbook', { method: 'DELETE' });
}

// Admin guest book actions
export async function deleteGuestbookEntry(entryId) {
    return request(`/guestbook/${entryId}`, { method: 'DELETE' });
}

export async function deleteAllGuestbookEntries() {
    return request('/guestbook/all', { method: 'DELETE' });
}

// --- Users (admin) ---
export async function getUsers() {
    return requestWithRetry('/users', { method: 'GET' });
}

export async function deleteUser(userId) {
    return request(`/users/${userId}`, { method: 'DELETE' });
}

export async function deleteAllUsers() {
    return request('/users', { method: 'DELETE' });
}
