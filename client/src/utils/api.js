const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(endpoint, options = {}) {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let response;

    try {
        response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
            credentials: 'include', // send cookies (httpOnly JWT)
            ...options,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        });
    } catch (error) {
        return { error: error?.message || 'Network request failed', status: 0 };
    }

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

// --- Contact (public + admin) ---
export async function postContact(contact) {
    return request('/contacts', { method: 'POST', body: JSON.stringify(contact) });
}

export async function getContacts() {
    return request('/contacts', { method: 'GET' });
}

export async function deleteContact(contactId) {
    return request(`/contacts/${contactId}`, { method: 'DELETE' });
}

export async function deleteAllContacts() {
    return request('/contacts', { method: 'DELETE' });
}

// --- Education / Qualifications ---
export async function getQualifications() {
    return request('/qualifications', { method: 'GET' });
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
    return request('/projects', { method: 'GET' });
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
    return request('/services', { method: 'GET' });
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
    return request('/gallery', { method: 'GET' });
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
    return request('/guestbook', { method: 'GET' });
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
    return request('/users', { method: 'GET' });
}

export async function deleteUser(userId) {
    return request(`/users/${userId}`, { method: 'DELETE' });
}

export async function deleteAllUsers() {
    return request('/users', { method: 'DELETE' });
}
