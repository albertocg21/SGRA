import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary';
}

export default function Button({
    children,
    onClick,
    className = '',
    variant = 'primary'
}: ButtonProps) {
    const baseStyles = 'px-4 py-2 rounded font-semibold transition-colors';
    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    );
}
