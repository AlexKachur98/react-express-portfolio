/**
 * @file useForm.js
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Custom hook for form state management with validation support.
 */
import { useState, useCallback } from 'react';

/**
 * Hook for managing form state, validation, and field changes.
 * Matches the existing handleChange('field')(event) pattern used in admin components.
 *
 * @param {Object} initialValues - Initial form field values
 * @param {Function} [validate] - Optional validation function (values) => errors object
 * @returns {Object} Form state and control functions
 */
export default function useForm(initialValues, validate) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    /**
     * Creates a change handler for a specific field.
     * Supports text inputs, textareas, checkboxes, and file inputs.
     *
     * @param {string} field - The field name to update
     * @returns {Function} Event handler function
     */
    const handleChange = useCallback(
        (field) => (event) => {
            const { type, checked, value, files } = event.target;

            let newValue;
            if (type === 'checkbox') {
                newValue = checked;
            } else if (type === 'file') {
                newValue = files?.[0] || null;
            } else {
                newValue = value;
            }

            setValues((prev) => ({ ...prev, [field]: newValue }));

            // Clear field error when user starts typing
            if (errors[field]) {
                setErrors((prev) => {
                    const next = { ...prev };
                    delete next[field];
                    return next;
                });
            }
        },
        [errors]
    );

    /**
     * Creates a blur handler for a specific field.
     * Marks the field as touched for showing validation errors.
     *
     * @param {string} field - The field name
     * @returns {Function} Event handler function
     */
    const handleBlur = useCallback(
        (field) => () => {
            setTouched((prev) => ({ ...prev, [field]: true }));
        },
        []
    );

    /**
     * Validates the form and returns whether it's valid.
     * @returns {boolean} True if form is valid
     */
    const validateForm = useCallback(() => {
        if (!validate) return true;

        const validationErrors = validate(values);
        setErrors(validationErrors);

        // Mark all fields as touched to show errors
        const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);

        return Object.keys(validationErrors).length === 0;
    }, [values, validate]);

    /**
     * Resets form to initial values and clears errors.
     * @param {Object} [newInitialValues] - Optional new initial values
     */
    const reset = useCallback(
        (newInitialValues) => {
            setValues(newInitialValues || initialValues);
            setErrors({});
            setTouched({});
        },
        [initialValues]
    );

    /**
     * Sets multiple field values at once.
     * Useful for populating form when editing an existing item.
     *
     * @param {Object} newValues - Object with field values to set
     */
    const setFieldValues = useCallback((newValues) => {
        setValues((prev) => ({ ...prev, ...newValues }));
    }, []);

    /**
     * Sets a single field's error.
     * @param {string} field - Field name
     * @param {string} error - Error message
     */
    const setFieldError = useCallback((field, error) => {
        setErrors((prev) => ({ ...prev, [field]: error }));
    }, []);

    /**
     * Checks if a specific field has an error that should be shown.
     * Only shows error if field has been touched.
     *
     * @param {string} field - Field name
     * @returns {string|null} Error message or null
     */
    const getFieldError = useCallback(
        (field) => {
            return touched[field] ? errors[field] : null;
        },
        [touched, errors]
    );

    /**
     * Check if form has any errors.
     * @returns {boolean} True if form has errors
     */
    const hasErrors = Object.keys(errors).length > 0;

    /**
     * Check if form is dirty (values differ from initial).
     * @returns {boolean} True if form has been modified
     */
    const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

    return {
        values,
        errors,
        touched,
        hasErrors,
        isDirty,
        handleChange,
        handleBlur,
        validateForm,
        reset,
        setValues,
        setFieldValues,
        setFieldError,
        getFieldError
    };
}

/**
 * Common validation helpers.
 */
export const validators = {
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

/**
 * Creates a validation function from a rules object.
 *
 * @param {Object} rules - Object mapping field names to arrays of validator functions
 * @returns {Function} Validation function that returns errors object
 *
 * @example
 * const validate = createValidator({
 *   email: [validators.required, validators.email],
 *   name: [validators.required, validators.minLength(2)]
 * });
 */
export function createValidator(rules) {
    return (values) => {
        const errors = {};

        for (const [field, fieldRules] of Object.entries(rules)) {
            for (const rule of fieldRules) {
                const error = rule(values[field]);
                if (error) {
                    errors[field] = error;
                    break; // Stop at first error for this field
                }
            }
        }

        return errors;
    };
}
