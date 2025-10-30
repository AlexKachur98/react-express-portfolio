import React from 'react';

export default function LinkedInIcon({ className = '', ...props }) {
    return (
        <svg
            className={className}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            {...props}
        >
            <path
                d="M5.5 9h3v10h-3V9Zm1.5-5.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5Zm5 5.5h2.88v1.37h.04a3.16 3.16 0 0 1 2.84-1.56c3.04 0 3.6 2 3.6 4.6V19h-3v-4.8c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.54V19h-3V9Z"
                fill="currentColor"
            />
        </svg>
    );
}
