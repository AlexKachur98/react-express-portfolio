const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

async function request(endpoint, options = {}) {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    });

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

export async function postContact(contact) {
    return request('/contacts', {
        method: 'POST',
        body: JSON.stringify(contact)
    });
}

export async function signup(user) {
    return request('/users', {
        method: 'POST',
        body: JSON.stringify(user)
    });
}

export async function signin(credentials) {
    return request('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
}

export async function signout() {
    return request('/auth/signout', {
        method: 'GET'
    });
}

export async function getProjects() {
    return request('/projects', { method: 'GET' });
}

export async function getQualifications() {
    return request('/qualifications', { method: 'GET' });
}

export async function getServices() {
    return request('/services', { method: 'GET' });
}

export async function getGallery() {
    return request('/gallery', { method: 'GET' });
}

const authHeader = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

export async function getContacts(token) {
    return request('/contacts', {
        method: 'GET',
        headers: authHeader(token)
    });
}

export async function createProject(data, token) {
    return request('/projects', {
        method: 'POST',
        headers: authHeader(token),
        body: JSON.stringify(data)
    });
}

export async function updateProject(projectId, data, token) {
    return request(`/projects/${projectId}`, {
        method: 'PUT',
        headers: authHeader(token),
        body: JSON.stringify(data)
    });
}

export async function deleteProject(projectId, token) {
    return request(`/projects/${projectId}`, {
        method: 'DELETE',
        headers: authHeader(token)
    });
}

export async function createQualification(data, token) {
    return request('/qualifications', {
        method: 'POST',
        headers: authHeader(token),
        body: JSON.stringify(data)
    });
}

export async function updateQualification(educationId, data, token) {
    return request(`/qualifications/${educationId}`, {
        method: 'PUT',
        headers: authHeader(token),
        body: JSON.stringify(data)
    });
}

export async function deleteQualification(educationId, token) {
    return request(`/qualifications/${educationId}`, {
        method: 'DELETE',
        headers: authHeader(token)
    });
}

export async function createService(data, token) {
    return request('/services', {
        method: 'POST',
        headers: authHeader(token),
        body: JSON.stringify(data)
    });
}

export async function updateService(serviceId, data, token) {
    return request(`/services/${serviceId}`, {
        method: 'PUT',
        headers: authHeader(token),
        body: JSON.stringify(data)
    });
}

export async function deleteService(serviceId, token) {
    return request(`/services/${serviceId}`, {
        method: 'DELETE',
        headers: authHeader(token)
    });
}

export async function createGalleryItem(data, token) {
    return request('/gallery', {
        method: 'POST',
        headers: authHeader(token),
        body: JSON.stringify(data)
    });
}

export async function updateGalleryItem(galleryId, data, token) {
    return request(`/gallery/${galleryId}`, {
        method: 'PUT',
        headers: authHeader(token),
        body: JSON.stringify(data)
    });
}

export async function deleteGalleryItem(galleryId, token) {
    return request(`/gallery/${galleryId}`, {
        method: 'DELETE',
        headers: authHeader(token)
    });
}

export async function deleteAllGalleryItems(token) {
    return request('/gallery', {
        method: 'DELETE',
        headers: authHeader(token)
    });
}
