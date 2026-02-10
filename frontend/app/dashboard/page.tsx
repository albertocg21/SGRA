'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        api.get('/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {stats ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Usuarios</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.users}</dd>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Total Recursos</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.resources}</dd>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Reservas Hoy</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.reservas_today}</dd>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">Cargando estadísticas...</div>
                )}
            </main>
        </div>
    );
}
