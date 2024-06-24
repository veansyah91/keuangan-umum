import React from 'react';

export default function BadgeWarning({ children, width = '' }) {
    return (
        <span
            className={`inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 ${width}`}>
            {children}
        </span>
    );
}
