/**
 * @file formValidators.test.js
 * @purpose Tests for form validation logic (mirrors client-side validators)
 */

// Validator implementations (matching client-side useForm.js validators)
const validators = {
    required: (value) => (!value?.toString().trim() ? 'This field is required' : null),

    email: (value) => {
        if (!value) return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : 'Please enter a valid email address';
    },

    minLength: (min) => (value) => {
        if (!value) return null;
        return value.length >= min ? null : `Must be at least ${min} characters`;
    },

    maxLength: (max) => (value) => {
        if (!value) return null;
        return value.length <= max ? null : `Must be no more than ${max} characters`;
    },

    url: (value) => {
        if (!value) return null;
        try {
            new URL(value);
            return null;
        } catch {
            return 'Please enter a valid URL';
        }
    }
};

const createValidator = (rules) => {
    return (values) => {
        const errors = {};

        for (const [field, fieldRules] of Object.entries(rules)) {
            for (const rule of fieldRules) {
                const error = rule(values[field]);
                if (error) {
                    errors[field] = error;
                    break;
                }
            }
        }

        return errors;
    };
};

describe('Required Validator', () => {
    test('should return error for empty string', () => {
        expect(validators.required('')).toBe('This field is required');
    });

    test('should return error for whitespace only', () => {
        expect(validators.required('   ')).toBe('This field is required');
    });

    test('should return error for null', () => {
        expect(validators.required(null)).toBe('This field is required');
    });

    test('should return error for undefined', () => {
        expect(validators.required(undefined)).toBe('This field is required');
    });

    test('should return null for valid string', () => {
        expect(validators.required('hello')).toBe(null);
    });

    test('should return null for number 0', () => {
        expect(validators.required(0)).toBe(null);
    });

    test('should return null for non-empty value with spaces', () => {
        expect(validators.required('  hello  ')).toBe(null);
    });
});

describe('Email Validator', () => {
    test('should return null for empty value (optional)', () => {
        expect(validators.email('')).toBe(null);
        expect(validators.email(null)).toBe(null);
    });

    test('should accept valid email addresses', () => {
        expect(validators.email('test@example.com')).toBe(null);
        expect(validators.email('user.name@domain.co.uk')).toBe(null);
        expect(validators.email('user+tag@example.org')).toBe(null);
    });

    test('should reject invalid email addresses', () => {
        expect(validators.email('invalid')).toBe('Please enter a valid email address');
        expect(validators.email('invalid@')).toBe('Please enter a valid email address');
        expect(validators.email('@example.com')).toBe('Please enter a valid email address');
        expect(validators.email('test@.com')).toBe('Please enter a valid email address');
    });

    test('should reject emails with spaces', () => {
        expect(validators.email('test @example.com')).toBe('Please enter a valid email address');
        expect(validators.email('test@ example.com')).toBe('Please enter a valid email address');
    });
});

describe('minLength Validator', () => {
    const minLength8 = validators.minLength(8);

    test('should return null for empty value (optional)', () => {
        expect(minLength8('')).toBe(null);
        expect(minLength8(null)).toBe(null);
    });

    test('should return error for short strings', () => {
        expect(minLength8('short')).toBe('Must be at least 8 characters');
        expect(minLength8('1234567')).toBe('Must be at least 8 characters');
    });

    test('should return null for strings meeting minimum', () => {
        expect(minLength8('12345678')).toBe(null);
        expect(minLength8('longer string here')).toBe(null);
    });

    test('should handle different min lengths', () => {
        const minLength3 = validators.minLength(3);
        expect(minLength3('ab')).toBe('Must be at least 3 characters');
        expect(minLength3('abc')).toBe(null);
    });
});

describe('maxLength Validator', () => {
    const maxLength10 = validators.maxLength(10);

    test('should return null for empty value (optional)', () => {
        expect(maxLength10('')).toBe(null);
        expect(maxLength10(null)).toBe(null);
    });

    test('should return error for long strings', () => {
        expect(maxLength10('this is way too long')).toBe('Must be no more than 10 characters');
    });

    test('should return null for strings within limit', () => {
        expect(maxLength10('short')).toBe(null);
        expect(maxLength10('1234567890')).toBe(null); // exactly 10
    });
});

describe('URL Validator', () => {
    test('should return null for empty value (optional)', () => {
        expect(validators.url('')).toBe(null);
        expect(validators.url(null)).toBe(null);
    });

    test('should accept valid URLs', () => {
        expect(validators.url('https://example.com')).toBe(null);
        expect(validators.url('http://localhost:3000')).toBe(null);
        expect(validators.url('https://example.com/path?query=1')).toBe(null);
        expect(validators.url('ftp://files.example.com')).toBe(null);
    });

    test('should reject invalid URLs', () => {
        expect(validators.url('not-a-url')).toBe('Please enter a valid URL');
        expect(validators.url('example.com')).toBe('Please enter a valid URL');
        expect(validators.url('://missing-protocol.com')).toBe('Please enter a valid URL');
    });
});

describe('createValidator', () => {
    test('should validate multiple fields', () => {
        const validate = createValidator({
            name: [validators.required],
            email: [validators.required, validators.email]
        });

        const errors = validate({ name: '', email: '' });

        expect(errors.name).toBe('This field is required');
        expect(errors.email).toBe('This field is required');
    });

    test('should stop at first error for each field', () => {
        const validate = createValidator({
            email: [validators.required, validators.email, validators.minLength(10)]
        });

        // Empty email hits required first
        const errors1 = validate({ email: '' });
        expect(errors1.email).toBe('This field is required');

        // Invalid email format hits email validator
        const errors2 = validate({ email: 'bad' });
        expect(errors2.email).toBe('Please enter a valid email address');

        // Valid format but too short - email passes, minLength fails
        const errors3 = validate({ email: 'a@b.co' });
        expect(errors3.email).toBe('Must be at least 10 characters');
    });

    test('should return empty object for valid form', () => {
        const validate = createValidator({
            name: [validators.required],
            email: [validators.required, validators.email]
        });

        const errors = validate({ name: 'John', email: 'john@example.com' });

        expect(Object.keys(errors)).toHaveLength(0);
    });

    test('should handle optional fields', () => {
        const validate = createValidator({
            name: [validators.required],
            website: [validators.url] // optional, no required validator
        });

        // Empty website is fine
        const errors1 = validate({ name: 'John', website: '' });
        expect(errors1.website).toBeUndefined();

        // Invalid website is not
        const errors2 = validate({ name: 'John', website: 'bad-url' });
        expect(errors2.website).toBe('Please enter a valid URL');
    });
});

describe('Form Validation Edge Cases', () => {
    test('should handle complex validation scenarios', () => {
        const validate = createValidator({
            password: [validators.required, validators.minLength(8)],
            confirmPassword: [validators.required]
        });

        const errors = validate({
            password: 'short',
            confirmPassword: 'different'
        });

        expect(errors.password).toBe('Must be at least 8 characters');
        expect(errors.confirmPassword).toBeUndefined(); // passes required
    });

    test('should handle numeric string values', () => {
        expect(validators.required('0')).toBe(null);
        expect(validators.required('123')).toBe(null);
    });

    test('should preserve error messages from validators', () => {
        const customValidator = (value) => {
            if (value === 'forbidden') {
                return 'This value is not allowed';
            }
            return null;
        };

        const validate = createValidator({
            code: [customValidator]
        });

        const errors = validate({ code: 'forbidden' });
        expect(errors.code).toBe('This value is not allowed');
    });
});
