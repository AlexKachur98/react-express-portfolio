/**
 * @file useAsync.js
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Custom hook for handling async operations with loading, error, and data states.
 */
import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for managing async operations with automatic state handling.
 * Encapsulates the common pattern of loading/error/data states.
 *
 * @param {Function} asyncFn - The async function to execute
 * @param {boolean} [immediate=false] - Whether to execute immediately on mount
 * @returns {Object} State and control functions
 */
export default function useAsync(asyncFn, immediate = false) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);

    /**
     * Execute the async function and update state accordingly.
     * @param {...any} args - Arguments to pass to the async function
     * @returns {Promise<any>} The result of the async function
     */
    const execute = useCallback(
        async (...args) => {
            setLoading(true);
            setError(null);

            try {
                const result = await asyncFn(...args);

                // Handle API error responses (our api.js returns { error: string })
                if (result?.error) {
                    setError(result.error);
                    setLoading(false);
                    return result;
                }

                setData(result);
                setLoading(false);
                return result;
            } catch (err) {
                const errorMessage = err?.message || 'An unexpected error occurred';
                setError(errorMessage);
                setLoading(false);
                return { error: errorMessage };
            }
        },
        [asyncFn]
    );

    /**
     * Reset all state to initial values.
     */
    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    // Execute immediately if requested
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [immediate, execute]);

    return {
        data,
        loading,
        error,
        execute,
        reset,
        setData,
        setError
    };
}

/**
 * Variant of useAsync that executes immediately and re-executes when deps change.
 * Useful for data fetching on component mount.
 *
 * @param {Function} asyncFn - The async function to execute
 * @param {Array} [deps=[]] - Dependencies that trigger re-execution
 * @returns {Object} State and control functions
 */
export function useAsyncEffect(asyncFn, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const execute = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await asyncFn();

            if (result?.error) {
                setError(result.error);
            } else {
                setData(result);
            }
        } catch (err) {
            setError(err?.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        execute();
    }, [execute]);

    return {
        data,
        loading,
        error,
        refetch: execute,
        setData,
        setError
    };
}
