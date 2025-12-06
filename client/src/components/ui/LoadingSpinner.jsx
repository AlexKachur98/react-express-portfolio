/**
 * @file LoadingSpinner.jsx
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Reusable loading spinner component with consistent styling.
 */

/**
 * Loading spinner with optional text message.
 *
 * @param {Object} props
 * @param {string} [props.text='Loading...'] - Text to display below spinner
 * @param {string} [props.size='medium'] - Size variant: 'small', 'medium', 'large'
 * @param {boolean} [props.inline=false] - Display inline instead of block
 * @param {string} [props.className] - Additional CSS classes
 */
export default function LoadingSpinner({
    text = 'Loading...',
    size = 'medium',
    inline = false,
    className = ''
}) {
    const sizeStyles = {
        small: { width: '16px', height: '16px', borderWidth: '2px' },
        medium: { width: '24px', height: '24px', borderWidth: '3px' },
        large: { width: '40px', height: '40px', borderWidth: '4px' }
    };

    const containerStyle = {
        display: inline ? 'inline-flex' : 'flex',
        flexDirection: inline ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: inline ? '8px' : '12px',
        padding: inline ? '0' : '20px'
    };

    const spinnerStyle = {
        ...sizeStyles[size],
        border: `${sizeStyles[size].borderWidth} solid rgba(148, 163, 184, 0.3)`,
        borderTopColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    };

    const textStyle = {
        color: 'rgba(226, 232, 240, 0.85)',
        fontSize: size === 'small' ? '12px' : size === 'large' ? '16px' : '14px',
        margin: 0
    };

    return (
        <div
            className={`loading-spinner ${className}`}
            style={containerStyle}
            role="status"
            aria-live="polite"
        >
            <span style={spinnerStyle} aria-hidden="true" />
            {text && <span style={textStyle}>{text}</span>}
            <span className="visually-hidden">Loading</span>
        </div>
    );
}
