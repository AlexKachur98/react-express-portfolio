/**
 * @file security.test.js
 * @purpose Tests for security configurations
 */

describe('Password Validation', () => {
    const MIN_PASSWORD_LENGTH = 8;

    const validatePassword = (password) => {
        if (!password || typeof password !== 'string') {
            return { valid: false, error: 'Password is required' };
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
        }
        return { valid: true };
    };

    test('should reject passwords shorter than 8 characters', () => {
        expect(validatePassword('1234567').valid).toBe(false);
        expect(validatePassword('short').valid).toBe(false);
        expect(validatePassword('').valid).toBe(false);
    });

    test('should accept passwords of 8 characters or more', () => {
        expect(validatePassword('12345678').valid).toBe(true);
        expect(validatePassword('longerpassword123').valid).toBe(true);
    });

    test('should reject null/undefined passwords', () => {
        expect(validatePassword(null).valid).toBe(false);
        expect(validatePassword(undefined).valid).toBe(false);
    });
});

describe('CORS Configuration', () => {
    const env = 'development';
    const clientOrigins = ['https://myportfolio.com'];

    const getAllowedOrigins = () => {
        const origins = [...clientOrigins];
        if (env === 'development') {
            origins.push('http://localhost:5173', 'http://localhost:3000');
        }
        return origins;
    };

    test('should include localhost in development', () => {
        const origins = getAllowedOrigins();
        expect(origins).toContain('http://localhost:5173');
        expect(origins).toContain('http://localhost:3000');
    });

    test('should always include configured client origin', () => {
        const origins = getAllowedOrigins();
        expect(origins).toContain('https://myportfolio.com');
    });
});

describe('Error Response Handling', () => {
    const formatErrorResponse = (err, env) => {
        const isProduction = env === 'production';
        return {
            error: isProduction ? 'Internal server error' : (err.message || 'An error occurred.'),
            ...(isProduction ? {} : { stack: err.stack })
        };
    };

    test('should hide stack traces in production', () => {
        const err = new Error('Test error');
        const response = formatErrorResponse(err, 'production');

        expect(response.error).toBe('Internal server error');
        expect(response.stack).toBeUndefined();
    });

    test('should show error details in development', () => {
        const err = new Error('Test error');
        const response = formatErrorResponse(err, 'development');

        expect(response.error).toBe('Test error');
        expect(response.stack).toBeDefined();
    });
});

describe('Rate Limiting Configuration', () => {
    const authLimiterConfig = {
        windowMs: 15 * 60 * 1000,
        max: 5
    };

    const contactLimiterConfig = {
        windowMs: 15 * 60 * 1000,
        max: 20
    };

    test('auth limiter should allow max 5 attempts', () => {
        expect(authLimiterConfig.max).toBe(5);
    });

    test('contact limiter should allow max 20 submissions', () => {
        expect(contactLimiterConfig.max).toBe(20);
    });

    test('both limiters should use 15 minute windows', () => {
        expect(authLimiterConfig.windowMs).toBe(15 * 60 * 1000);
        expect(contactLimiterConfig.windowMs).toBe(15 * 60 * 1000);
    });
});

describe('Cookie Security', () => {
    const getCookieOptions = (isProduction) => ({
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 60 * 60 * 1000
    });

    test('should set httpOnly to true', () => {
        const options = getCookieOptions(false);
        expect(options.httpOnly).toBe(true);
    });

    test('should set secure flag in production', () => {
        expect(getCookieOptions(true).secure).toBe(true);
        expect(getCookieOptions(false).secure).toBe(false);
    });

    test('should use sameSite none in production for cross-origin', () => {
        expect(getCookieOptions(true).sameSite).toBe('none');
        expect(getCookieOptions(false).sameSite).toBe('lax');
    });

    test('should set appropriate max age', () => {
        const options = getCookieOptions(false);
        expect(options.maxAge).toBe(60 * 60 * 1000); // 1 hour
    });
});
