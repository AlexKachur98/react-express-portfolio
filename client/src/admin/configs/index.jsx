/**
 * @file index.jsx
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Entity configurations for AdminCrudPanel components.
 */

// Components
import { LazyImage } from '../../components/ui/index.js';

// Utils
import { getId } from '../../utils/getId.js';

// API functions
import {
    // Education/Qualifications
    getQualifications,
    createQualification,
    updateQualification,
    deleteQualification,
    deleteAllQualifications,
    // Projects
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    deleteAllProjects,
    // Services
    getServices,
    createService,
    updateService,
    deleteService,
    deleteAllServices,
    // Gallery
    getGalleryItems,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    deleteAllGalleryItems
} from '../../utils/api.js';

// ============================================================================
// Education / Qualifications Configuration
// ============================================================================
export const educationConfig = {
    entityName: 'Education',
    entityNamePlural: 'Qualifications',

    api: {
        list: getQualifications,
        create: createQualification,
        update: updateQualification,
        delete: deleteQualification,
        deleteAll: deleteAllQualifications
    },

    emptyForm: {
        program: '',
        school: '',
        period: '',
        location: '',
        detailsText: ''
    },

    formFields: [
        { name: 'program', label: 'Program', type: 'text', required: true, rowWith: 'school' },
        { name: 'school', label: 'School', type: 'text', required: true },
        { name: 'period', label: 'Period', type: 'text', required: true, rowWith: 'location' },
        { name: 'location', label: 'Location', type: 'text', required: true },
        { name: 'detailsText', label: 'Details (one per line)', type: 'textarea', rows: 5 }
    ],

    buildPayload: (form) => ({
        program: form.program,
        school: form.school,
        period: form.period,
        location: form.location,
        details: form.detailsText
            ? form.detailsText
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean)
            : []
    }),

    mapItemToForm: (item) => ({
        program: item.program || '',
        school: item.school || '',
        period: item.period || '',
        location: item.location || '',
        detailsText: Array.isArray(item.details) ? item.details.join('\n') : ''
    }),

    renderItem: (item) => (
        <>
            <strong>{item.program}</strong> — {item.school} &bull; {item.period} &bull;{' '}
            {item.location}
            {Array.isArray(item.details) && item.details.length > 0 && (
                <ul style={{ marginTop: '6px', marginBottom: 0, paddingLeft: '18px' }}>
                    {item.details.map((d, idx) => (
                        <li key={idx}>{d}</li>
                    ))}
                </ul>
            )}
        </>
    )
};

// ============================================================================
// Projects Configuration
// ============================================================================
export const projectsConfig = {
    entityName: 'Project',
    entityNamePlural: 'Projects',

    api: {
        list: getProjects,
        create: createProject,
        update: updateProject,
        delete: deleteProject,
        deleteAll: deleteAllProjects
    },

    emptyForm: {
        title: '',
        description: '',
        tags: '',
        image: '',
        github: '',
        live: ''
    },

    formFields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, required: true },
        { name: 'tags', label: 'Tags (comma separated)', type: 'text' },
        { name: 'image', label: 'Image URL', type: 'text', rowWith: 'github' },
        { name: 'github', label: 'GitHub URL', type: 'text' },
        { name: 'live', label: 'Live URL', type: 'text' }
    ],

    buildPayload: (form) => ({
        title: form.title,
        description: form.description,
        tags: form.tags
            ? form.tags
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [],
        image: form.image || undefined,
        github: form.github || undefined,
        live: form.live || undefined
    }),

    mapItemToForm: (item) => ({
        title: item.title || '',
        description: item.description || '',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
        image: item.image || '',
        github: item.github || '',
        live: item.live || ''
    }),

    renderItem: (item) => (
        <>
            <strong>{item.title}</strong>
            <div style={{ marginTop: '6px', color: 'rgba(226,232,240,0.85)' }}>
                {item.description}
            </div>
            <div style={{ marginTop: '6px', color: 'rgba(148,163,184,0.9)' }}>
                {Array.isArray(item.tags) ? item.tags.join(', ') : ''}
            </div>
        </>
    )
};

// ============================================================================
// Services Configuration
// ============================================================================
export const servicesConfig = {
    entityName: 'Service',
    entityNamePlural: 'Services',

    api: {
        list: getServices,
        create: createService,
        update: updateService,
        delete: deleteService,
        deleteAll: deleteAllServices
    },

    emptyForm: {
        title: '',
        description: '',
        highlight: false
    },

    formFields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3, required: true },
        { name: 'highlight', label: 'Highlight', type: 'checkbox' }
    ],

    buildPayload: (form) => ({ ...form }),

    mapItemToForm: (item) => ({
        title: item.title || '',
        description: item.description || '',
        highlight: Boolean(item.highlight)
    }),

    renderItem: (item) => (
        <>
            <strong>{item.title}</strong>{' '}
            {item.highlight && <span style={{ color: '#38bdf8' }}>(Highlight)</span>}
            <div style={{ marginTop: '6px', color: 'rgba(226,232,240,0.85)' }}>
                {item.description}
            </div>
        </>
    )
};

// ============================================================================
// Gallery Configuration
// ============================================================================

// File upload constraints
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Validates an image file before processing
 * @param {File} file - The file to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateImageFile = (file) => {
    if (!file) {
        return { valid: false, error: 'No file selected.' };
    }
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
        };
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP.' };
    }
    return { valid: true };
};

export const galleryConfig = {
    entityName: 'Image',
    entityNamePlural: 'Gallery Items',
    listLayout: 'grid',

    api: {
        list: getGalleryItems,
        create: createGalleryItem,
        update: updateGalleryItem,
        delete: deleteGalleryItem,
        deleteAll: deleteAllGalleryItems
    },

    emptyForm: {
        title: '',
        tags: '',
        imageData: ''
    },

    formFields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'tags', label: 'Tags (comma separated)', type: 'text' }
        // Note: Image upload handled via customFormFields
    ],

    buildPayload: (form) => ({
        title: form.title,
        tags: form.tags
            ? form.tags
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [],
        imageData: form.imageData
    }),

    mapItemToForm: (item) => ({
        title: item.title || '',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
        imageData: item.imageData || ''
    }),

    normalizeResponse: (item) => ({
        ...item,
        id: getId(item),
        tags: Array.isArray(item.tags) ? item.tags : []
    }),

    renderItem: (item) => (
        <>
            {item.imageData && (
                <LazyImage
                    src={item.imageData}
                    alt={item.title}
                    style={{
                        width: '100%',
                        height: '150px',
                        borderRadius: '8px',
                        marginBottom: '8px'
                    }}
                />
            )}
            <strong>{item.title}</strong>
            <div style={{ fontSize: '0.85rem', color: 'rgba(148,163,184,0.9)' }}>
                {Array.isArray(item.tags) ? item.tags.join(', ') : ''}
            </div>
        </>
    )
};
