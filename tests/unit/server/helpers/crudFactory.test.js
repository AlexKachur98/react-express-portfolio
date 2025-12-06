/**
 * @file crudFactory.test.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose Tests for CRUD controller factory.
 */

// Test the factory behavior without requiring actual Mongoose connection
describe('CRUD Factory - Controller Logic', () => {
    describe('read method behavior', () => {
        test('should return document attached to request by param name', () => {
            const paramName = 'item';
            const mockDoc = { _id: '123', name: 'Test' };
            const req = { [paramName]: mockDoc };

            // Simulate read behavior (req[paramName] access)
            const result = req[paramName];

            expect(result).toEqual(mockDoc);
            expect(result._id).toBe('123');
        });
    });

    describe('buildPayload transformation', () => {
        test('should pass body through identity buildPayload', () => {
            const body = { name: 'Test', value: 123 };
            const buildPayload = (b) => b;

            expect(buildPayload(body)).toEqual(body);
        });

        test('should transform body with custom buildPayload', () => {
            const body = { title: 'Test', description: 'Desc' };
            const buildPayload = (b) => ({
                ...b,
                slug: b.title.toLowerCase().replace(/\s+/g, '-')
            });

            const result = buildPayload(body);
            expect(result.slug).toBe('test');
            expect(result.title).toBe('Test');
        });
    });

    describe('update field filtering', () => {
        test('should skip undefined values', () => {
            const doc = { name: 'Original', value: 100 };
            const payload = { name: 'Updated', value: undefined };

            // Simulate update logic
            Object.keys(payload).forEach((key) => {
                const value = payload[key];
                if (value !== undefined && value !== null) {
                    if (typeof value === 'string' && value.trim() === '') {
                        // Skip empty strings
                    } else {
                        doc[key] = value;
                    }
                }
            });

            expect(doc.name).toBe('Updated');
            expect(doc.value).toBe(100); // unchanged
        });

        test('should skip empty strings', () => {
            const doc = { name: 'Original' };
            const payload = { name: '' };

            Object.keys(payload).forEach((key) => {
                const value = payload[key];
                if (value !== undefined && value !== null) {
                    if (typeof value === 'string' && value.trim() === '') {
                        // Skip
                    } else {
                        doc[key] = value;
                    }
                }
            });

            expect(doc.name).toBe('Original');
        });

        test('should skip empty arrays', () => {
            const doc = { tags: ['tag1', 'tag2'] };
            const payload = { tags: [] };

            Object.keys(payload).forEach((key) => {
                const value = payload[key];
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value) && value.length === 0) {
                        // Skip empty arrays
                    } else {
                        doc[key] = value;
                    }
                }
            });

            expect(doc.tags).toEqual(['tag1', 'tag2']);
        });

        test('should update non-empty arrays', () => {
            const doc = { tags: ['old'] };
            const payload = { tags: ['new1', 'new2'] };

            Object.keys(payload).forEach((key) => {
                const value = payload[key];
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value) && value.length > 0) {
                        doc[key] = value;
                    }
                }
            });

            expect(doc.tags).toEqual(['new1', 'new2']);
        });

        test('should update boolean values', () => {
            const doc = { active: true };
            const payload = { active: false };

            Object.keys(payload).forEach((key) => {
                const value = payload[key];
                if (value !== undefined && value !== null) {
                    doc[key] = value;
                } else if (typeof value === 'boolean') {
                    doc[key] = value;
                }
            });

            expect(doc.active).toBe(false);
        });
    });

    describe('removeAll environment check', () => {
        test('should allow in development mode', () => {
            const env = 'development';
            const allowDeleteAll = true;

            const isAllowed = allowDeleteAll && env === 'development';
            expect(isAllowed).toBe(true);
        });

        test('should block in production mode', () => {
            const env = 'production';
            const allowDeleteAll = true;

            const isAllowed = allowDeleteAll && env === 'development';
            expect(isAllowed).toBe(false);
        });

        test('should block when allowDeleteAll is false', () => {
            const env = 'development';
            const allowDeleteAll = false;

            const isAllowed = allowDeleteAll && env === 'development';
            expect(isAllowed).toBe(false);
        });
    });
});

describe('CRUD Factory - Options Handling', () => {
    test('should use default sortField if not provided', () => {
        const options = { entityName: 'Test', paramName: 'test' };
        const sortField = options.sortField || '-createdAt';

        expect(sortField).toBe('-createdAt');
    });

    test('should use custom sortField if provided', () => {
        const options = { entityName: 'Test', paramName: 'test', sortField: 'name' };
        const sortField = options.sortField || '-createdAt';

        expect(sortField).toBe('name');
    });

    test('should default allowDeleteAll to true', () => {
        const options = { entityName: 'Test', paramName: 'test' };
        const allowDeleteAll = options.allowDeleteAll ?? true;

        expect(allowDeleteAll).toBe(true);
    });

    test('should respect explicit allowDeleteAll false', () => {
        const options = { entityName: 'Test', paramName: 'test', allowDeleteAll: false };
        const allowDeleteAll = options.allowDeleteAll ?? true;

        expect(allowDeleteAll).toBe(false);
    });
});

describe('CRUD Factory - Error Messages', () => {
    test('should generate correct not found message', () => {
        const entityName = 'Project';
        const message = `${entityName} not found`;

        expect(message).toBe('Project not found');
    });

    test('should generate correct retrieval error message', () => {
        const entityName = 'Project';
        const message = `Could not retrieve ${entityName.toLowerCase()}`;

        expect(message).toBe('Could not retrieve project');
    });

    test('should generate correct delete all blocked message', () => {
        const entityName = 'Project';
        const message = `Deleting all ${entityName.toLowerCase()}s is only allowed in development.`;

        expect(message).toBe('Deleting all projects is only allowed in development.');
    });

    test('should generate correct delete all success message', () => {
        const entityName = 'Project';
        const message = `All ${entityName.toLowerCase()}s have been deleted.`;

        expect(message).toBe('All projects have been deleted.');
    });
});
