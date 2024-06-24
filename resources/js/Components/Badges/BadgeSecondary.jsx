import React from 'react';

export default function BadgeSecondary({ children, width = '' }) {
    return (
        <span
            className={`inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20 ${width}`}>
            {children}
        </span>
    );
}
