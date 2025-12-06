/**
 * @file EmptyState.jsx
 * @author Alex Kachur
 * @since 2025-12-04
 * @purpose Reusable empty state component for when lists have no items.
 */

/**
 * Empty state display for empty lists or no results.
 *
 * @param {Object} props
 * @param {string} [props.icon] - Emoji or icon character to display
 * @param {string} props.title - Main message
 * @param {string} [props.description] - Secondary description text
 * @param {React.ReactNode} [props.action] - Optional action button/link
 * @param {string} [props.className] - Additional CSS classes
 */
export default function EmptyState({ icon, title, description, action, className = '' }) {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center'
    };

    const iconStyle = {
        fontSize: '48px',
        marginBottom: '16px',
        opacity: 0.7
    };

    const titleStyle = {
        color: 'rgba(226, 232, 240, 0.95)',
        fontSize: '18px',
        fontWeight: 500,
        margin: '0 0 8px 0'
    };

    const descriptionStyle = {
        color: 'rgba(148, 163, 184, 0.85)',
        fontSize: '14px',
        margin: '0 0 16px 0',
        maxWidth: '300px'
    };

    return (
        <div className={`empty-state ${className}`} style={containerStyle}>
            {icon && (
                <span style={iconStyle} aria-hidden="true">
                    {icon}
                </span>
            )}
            <h3 style={titleStyle}>{title}</h3>
            {description && <p style={descriptionStyle}>{description}</p>}
            {action && <div className="empty-state__action">{action}</div>}
        </div>
    );
}
