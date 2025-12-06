/**
 * @file getId.test.js
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose Unit tests for getId utility function.
 */

import { getId } from '../../../../client/src/utils/getId.js';

describe('getId utility', () => {
    describe('with MongoDB _id', () => {
        it('returns _id when present', () => {
            const item = { _id: 'mongo123', name: 'Test' };
            expect(getId(item)).toBe('mongo123');
        });

        it('prefers _id over id when both present', () => {
            const item = { _id: 'mongo123', id: 'other456', name: 'Test' };
            expect(getId(item)).toBe('mongo123');
        });
    });

    describe('with normalized id', () => {
        it('returns id when _id is not present', () => {
            const item = { id: 'normalized123', name: 'Test' };
            expect(getId(item)).toBe('normalized123');
        });
    });

    describe('edge cases', () => {
        it('returns undefined for null input', () => {
            expect(getId(null)).toBeUndefined();
        });

        it('returns undefined for undefined input', () => {
            expect(getId(undefined)).toBeUndefined();
        });

        it('returns undefined when neither _id nor id present', () => {
            const item = { name: 'Test' };
            expect(getId(item)).toBeUndefined();
        });

        it('handles empty object', () => {
            expect(getId({})).toBeUndefined();
        });

        it('handles falsy _id value', () => {
            const item = { _id: '', id: 'fallback' };
            expect(getId(item)).toBe('');
        });

        it('handles null _id with valid id', () => {
            const item = { _id: null, id: 'fallback' };
            expect(getId(item)).toBe('fallback');
        });
    });
});
