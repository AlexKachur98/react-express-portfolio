/**
 * @file AdminGallery.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Admin UI to upload, edit, and delete cat gallery images.
 */

// React
import { useState, useCallback } from 'react';

// Components & Configs
import AdminCrudPanel from './components/AdminCrudPanel.jsx';
import { galleryConfig, validateImageFile } from './configs/index.jsx';

/**
 * Custom form fields component for gallery with file upload support.
 */
function GalleryFormFields({ form, handleChange, setForm }) {
    const [fileError, setFileError] = useState('');

    const handleFile = useCallback(
        (event) => {
            const file = event.target.files?.[0];
            if (!file) return;

            // Validate file before processing
            const validation = validateImageFile(file);
            if (!validation.valid) {
                setFileError(validation.error);
                event.target.value = ''; // Reset file input
                return;
            }

            setFileError('');
            const reader = new FileReader();

            reader.onerror = () => {
                setFileError('Failed to read file. Please try again.');
                event.target.value = '';
            };

            reader.onload = () => {
                const result = reader.result;
                // Additional validation: ensure it's a valid base64 image
                if (!result || !result.startsWith('data:image/')) {
                    setFileError('Invalid image data. Please select a valid image file.');
                    event.target.value = '';
                    return;
                }
                setForm((prev) => ({ ...prev, imageData: result }));
            };

            reader.readAsDataURL(file);
        },
        [setForm]
    );

    return (
        <>
            <label>
                Title
                <input type="text" value={form.title} onChange={handleChange('title')} required />
            </label>
            <label>
                Tags (comma separated)
                <input type="text" value={form.tags} onChange={handleChange('tags')} />
            </label>
            <label>
                Image
                <input type="file" accept="image/*" onChange={handleFile} />
            </label>
            {fileError && <p className="contact-form__error">{fileError}</p>}
            {form.imageData && (
                <div style={{ marginBottom: '12px' }}>
                    <img
                        src={form.imageData}
                        alt="Preview"
                        style={{ maxWidth: '200px', borderRadius: '8px' }}
                    />
                </div>
            )}
        </>
    );
}

export default function AdminGallery() {
    return <AdminCrudPanel {...galleryConfig} customFormFields={GalleryFormFields} />;
}
