import React from 'react';

export default function Header({ textColor = 'text-gray-800', children, className }) {
    return <h2 className={`font-semibold text-xl leading-tight ${textColor} ${className}`}>{children}</h2>;
}
