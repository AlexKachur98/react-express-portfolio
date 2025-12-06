/**
 * @file AdminListItem.jsx
 * @author Alex Kachur
 * @since 2025-12-05
 * @purpose Memoized list item component for admin panels to prevent unnecessary re-renders.
 */
import { memo } from 'react';
import { getId } from '../../utils/getId.js';

/**
 * Memoized admin list item component.
 * Prevents re-renders when other items in the list change.
 *
 * @param {Object} props
 * @param {Object} props.item - The item data
 * @param {string} props.layout - Layout type: 'list' or 'grid'
 * @param {Function} props.renderItem - Function to render item content
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 */
function AdminListItem({ item, layout, renderItem, onEdit, onDelete }) {
    const id = getId(item);

    const containerStyle =
        layout === 'grid'
            ? {
                  border: '1px solid rgba(148,163,184,0.25)',
                  borderRadius: '10px',
                  padding: '10px'
              }
            : {
                  borderBottom: '1px solid rgba(148,163,184,0.2)',
                  padding: '10px 0'
              };

    return (
        <div style={containerStyle}>
            {renderItem(item)}
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => onEdit(item)}
                    aria-label={`Edit item ${id}`}
                >
                    Edit
                </button>
                <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => onDelete(id)}
                    aria-label={`Delete item ${id}`}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

/**
 * Shallow equality comparison for objects.
 * More performant than JSON.stringify and handles edge cases better.
 *
 * @param {Object} obj1 - First object
 * @param {Object} obj2 - Second object
 * @returns {boolean} True if objects are shallowly equal
 */
function shallowEqual(obj1, obj2) {
    if (obj1 === obj2) return true;
    if (!obj1 || !obj2) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => {
        const val1 = obj1[key];
        const val2 = obj2[key];

        // Handle arrays (common in form data)
        if (Array.isArray(val1) && Array.isArray(val2)) {
            return val1.length === val2.length && val1.every((v, i) => v === val2[i]);
        }

        return val1 === val2;
    });
}

/**
 * Custom comparison function for memo.
 * Only re-renders if item data, layout, or handlers change.
 */
function areEqual(prevProps, nextProps) {
    // Compare item by ID and relevant fields
    const prevId = getId(prevProps.item);
    const nextId = getId(nextProps.item);

    if (prevId !== nextId) return false;
    if (prevProps.layout !== nextProps.layout) return false;

    // Shallow compare item content (for updates)
    // More performant than JSON.stringify
    if (!shallowEqual(prevProps.item, nextProps.item)) {
        return false;
    }

    // Handlers are typically stable (useCallback), so we skip comparing them
    // If they're not stable, the parent should memoize them
    return true;
}

export default memo(AdminListItem, areEqual);
