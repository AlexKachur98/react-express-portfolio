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
