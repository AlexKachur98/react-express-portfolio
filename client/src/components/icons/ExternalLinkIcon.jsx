/**
 * @file ExternalLinkIcon.jsx
 * @author Alex Kachur
 * @since 2025-10-28
 * @purpose SVG icon component for external link indicators.
 */
export default function ExternalLinkIcon({ className = '', ...props }) {
    return (
        <svg
            className={className}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            {...props}
        >
            <path
                d="M13 5h6v6m0-6-7.5 7.5M19 13.5V19a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1h5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
