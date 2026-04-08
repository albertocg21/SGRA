'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (!user) return null;

    const isActive = (path: string) =>
        pathname === path
            ? 'border-indigo-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';

    const links = [
        ...(user.role === 'admin' ? [
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/resources', label: 'Recursos' },
            { href: '/users', label: 'Usuarios' },
        ] : []),
        { href: '/calendar', label: 'Calendario' },
        { href: '/bookings', label: 'Mis Reservas' },
    ];

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href={user.role === 'admin' ? '/dashboard' : '/calendar'}>
                                <span className="font-bold text-xl text-indigo-600">SGRA</span>
                            </Link>
                        </div>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                            {links.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`${isActive(link.href)} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        <div className="text-sm">
                            <span className="text-gray-700 font-medium">{user.name}</span>
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                                {user.role}
                            </span>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                        >
                            Cerrar sesion
                        </button>
                    </div>

                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {mobileOpen && (
                <div className="sm:hidden border-t border-gray-200">
                    <div className="pt-2 pb-3 space-y-1">
                        {links.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                                    pathname === link.href
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="flex items-center px-4">
                            <div>
                                <div className="text-base font-medium text-gray-800">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                        </div>
                        <div className="mt-3 px-2">
                            <button
                                onClick={logout}
                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                            >
                                Cerrar sesion
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
