/**
 * @file validation.test.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose Tests for input validation and sanitization.
 */
import xss from 'xss';

describe('XSS Sanitization', () => {
    test('should sanitize script tags from input', () => {
        const maliciousInput = '<script>alert("xss")</script>Hello';
        const sanitized = xss(maliciousInput);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).toContain('Hello');
    });

    test('should sanitize event handlers from input', () => {
        const maliciousInput = '<img src="x" onerror="alert(1)">';
        const sanitized = xss(maliciousInput);
        expect(sanitized).not.toContain('onerror');
    });

    test('should preserve safe text content', () => {
        const safeInput = 'Hello, my name is John. Contact me at john@example.com';
        const sanitized = xss(safeInput);
        expect(sanitized).toBe(safeInput);
    });

    test('should handle empty strings', () => {
        const sanitized = xss('');
        expect(sanitized).toBe('');
    });
});

describe('Image Validation', () => {
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    const validateImageData = (imageData) => {
        if (!imageData || typeof imageData !== 'string') {
            return { valid: false, error: 'Image data is required.' };
        }

        const dataUrlMatch = imageData.match(/^data:([^;]+);base64,(.+)$/);
        if (!dataUrlMatch) {
            return { valid: false, error: 'Invalid image data format.' };
        }

        const mimeType = dataUrlMatch[1];
        const base64Data = dataUrlMatch[2];

        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
            return { valid: false, error: 'Invalid image type.' };
        }

        const approximateSize = Math.ceil((base64Data.length * 3) / 4);
        if (approximateSize > MAX_IMAGE_SIZE) {
            return { valid: false, error: 'Image too large.' };
        }

        return { valid: true };
    };

    test('should accept valid JPEG image data URL', () => {
        const validImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD';
        const result = validateImageData(validImage);
        expect(result.valid).toBe(true);
    });

    test('should accept valid PNG image data URL', () => {
        const validImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB';
        const result = validateImageData(validImage);
        expect(result.valid).toBe(true);
    });

    test('should reject invalid MIME type', () => {
        const invalidImage = 'data:application/pdf;base64,JVBERi0xLjQK';
        const result = validateImageData(invalidImage);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('Invalid image type');
    });

    test('should reject non-data URL strings', () => {
        const invalidImage = 'https://example.com/image.jpg';
        const result = validateImageData(invalidImage);
        expect(result.valid).toBe(false);
    });

    test('should reject empty strings', () => {
        const result = validateImageData('');
        expect(result.valid).toBe(false);
    });

    test('should reject null/undefined', () => {
        expect(validateImageData(null).valid).toBe(false);
        expect(validateImageData(undefined).valid).toBe(false);
    });
});

describe('Pagination Validation', () => {
    const MAX_LIMIT = 100;
    const DEFAULT_LIMIT = 20;

    const parsePaginationParams = (query = {}) => {
        const page = Math.max(1, parseInt(query.page, 10) || 1);
        const requestedLimit = parseInt(query.limit, 10) || DEFAULT_LIMIT;
        const limit = Math.min(Math.max(1, requestedLimit), MAX_LIMIT);
        return { page, limit };
    };

    test('should cap limit at MAX_LIMIT', () => {
        const result = parsePaginationParams({ limit: '500' });
        expect(result.limit).toBe(MAX_LIMIT);
    });

    test('should use default limit when not provided', () => {
        const result = parsePaginationParams({});
        expect(result.limit).toBe(DEFAULT_LIMIT);
    });

    test('should default page to 1 for invalid values', () => {
        expect(parsePaginationParams({ page: '-1' }).page).toBe(1);
        expect(parsePaginationParams({ page: '0' }).page).toBe(1);
        expect(parsePaginationParams({ page: 'abc' }).page).toBe(1);
    });

    test('should parse valid page numbers', () => {
        expect(parsePaginationParams({ page: '5' }).page).toBe(5);
        expect(parsePaginationParams({ page: '100' }).page).toBe(100);
    });

    test('should handle edge case limits', () => {
        // 0 is falsy, so falls back to DEFAULT_LIMIT
        expect(parsePaginationParams({ limit: '0' }).limit).toBe(DEFAULT_LIMIT);
        // -5 is truthy, Math.max(1, -5) = 1
        expect(parsePaginationParams({ limit: '-5' }).limit).toBe(1);
    });
});
