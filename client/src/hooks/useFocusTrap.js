/**
 * @file useFocusTrap.js
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Custom hook to trap focus within a modal for accessibility.
 */
import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
].join(', ');

/**
 * Traps focus within a container element when active.
 * @param {boolean} isActive - Whether the focus trap should be active
 * @returns {React.RefObject} - Ref to attach to the container element
 */
export default function useFocusTrap(isActive) {
    const containerRef = useRef(null);
    const previousActiveElement = useRef(null);

    useEffect(() => {
        if (!isActive) return;

        // Store the currently focused element to restore later
        previousActiveElement.current = document.activeElement;

        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(FOCUSABLE_SELECTORS);
        const firstFocusable = focusableElements[0];

        // Focus the first focusable element
        if (firstFocusable) {
            firstFocusable.focus();
        }

        const handleKeyDown = (event) => {
            if (event.key !== 'Tab') return;

            // Re-query in case DOM changed
            const currentFocusables = container.querySelectorAll(FOCUSABLE_SELECTORS);
            const first = currentFocusables[0];
            const last = currentFocusables[currentFocusables.length - 1];

            if (event.shiftKey) {
                // Shift+Tab: if on first element, wrap to last
                if (document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                }
            } else {
                // Tab: if on last element, wrap to first
                if (document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }
        };

        container.addEventListener('keydown', handleKeyDown);

        return () => {
            container.removeEventListener('keydown', handleKeyDown);
            // Restore focus to the previously focused element
            if (previousActiveElement.current && previousActiveElement.current.focus) {
                previousActiveElement.current.focus();
            }
        };
    }, [isActive]);

    return containerRef;
}
