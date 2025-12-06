/**
 * @file ConfirmDialog.jsx
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Accessible confirmation dialog to replace window.confirm().
 */

// React
import { useEffect, useCallback } from 'react';

// Hooks
import useFocusTrap from '../../hooks/useFocusTrap.js';

/**
 * Accessible confirmation dialog with focus trapping and keyboard support.
 * Replaces the native window.confirm() with a styled, accessible alternative.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is visible
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Dialog message/description
 * @param {string} [props.confirmText='Confirm'] - Confirm button text
 * @param {string} [props.cancelText='Cancel'] - Cancel button text
 * @param {Function} props.onConfirm - Callback when confirmed
 * @param {Function} props.onCancel - Callback when cancelled
 * @param {string} [props.variant='danger'] - Visual variant: 'danger', 'warning', 'info'
 */
export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'danger'
}) {
    const dialogRef = useFocusTrap(isOpen);

    // Handle escape key
    const handleKeyDown = useCallback(
        (event) => {
            if (event.key === 'Escape') {
                onCancel();
            }
        },
        [onCancel]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll when dialog is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)'
    };

    const dialogStyle = {
        background: 'rgba(30, 41, 59, 0.95)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    };

    const titleStyle = {
        color: 'rgba(226, 232, 240, 0.95)',
        fontSize: '18px',
        fontWeight: 600,
        margin: '0 0 12px 0'
    };

    const messageStyle = {
        color: 'rgba(148, 163, 184, 0.9)',
        fontSize: '14px',
        lineHeight: 1.6,
        margin: '0 0 24px 0'
    };

    const actionsStyle = {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
    };

    const variantColors = {
        danger: { bg: 'rgba(239, 68, 68, 0.9)', hover: 'rgba(239, 68, 68, 1)' },
        warning: { bg: 'rgba(245, 158, 11, 0.9)', hover: 'rgba(245, 158, 11, 1)' },
        info: { bg: 'rgba(59, 130, 246, 0.9)', hover: 'rgba(59, 130, 246, 1)' }
    };

    const confirmButtonStyle = {
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        backgroundColor: variantColors[variant].bg,
        color: '#fff',
        transition: 'background-color 0.2s'
    };

    const cancelButtonStyle = {
        padding: '10px 20px',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        backgroundColor: 'transparent',
        color: 'rgba(226, 232, 240, 0.9)',
        transition: 'background-color 0.2s'
    };

    return (
        <div style={overlayStyle} onClick={onCancel} role="presentation">
            <div
                ref={dialogRef}
                style={dialogStyle}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-message"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="confirm-dialog-title" style={titleStyle}>
                    {title}
                </h2>
                <p id="confirm-dialog-message" style={messageStyle}>
                    {message}
                </p>
                <div style={actionsStyle}>
                    <button
                        type="button"
                        style={cancelButtonStyle}
                        onClick={onCancel}
                        className="btn btn--ghost"
                    >
                        {cancelText}
                    </button>
                    <button type="button" style={confirmButtonStyle} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
