'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';

interface Booking {
    id: number;
    resource_id: number;
    start_time: string;
    end_time: string;
    status: string;
    purpose: string;
    resource: { id: number; name: string; type: string };
    created_at: string;
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = () => {
        setLoading(true);
        api.get('/reservas?mine=true')
            .then(res => setBookings(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const handleCancel = async (id: number) => {
        if (!confirm('Seguro que quieres cancelar esta reserva?')) return;
        try {
            await api.delete(`/reservas/${id}`);
            setSuccess('Reserva cancelada correctamente.');
            fetchBookings();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al cancelar');
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isPast = (dateStr: string) => new Date(dateStr) < new Date();

    const upcoming = bookings.filter(b => !isPast(b.start_time));
    const past = bookings.filter(b => isPast(b.start_time));

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">Mis Reservas</h1>
                    <p className="text-sm text-gray-500 mt-1">Historial y gestion de tus reservas</p>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {success && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex justify-between items-center">
                        <span>{success}</span>
                        <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700 font-bold ml-4">x</button>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-12 text-center">
                        <h3 className="text-lg font-medium text-gray-900">No tienes reservas</h3>
                        <p className="mt-2 text-sm text-gray-500">Ve al calendario para crear tu primera reserva.</p>
                        <a href="/calendar" className="mt-4 inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                            Ir al Calendario
                        </a>
                    </div>
                ) : (
                    <>
                        {upcoming.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Proximas ({upcoming.length})
                                </h2>
                                <div className="space-y-3">
                                    {upcoming.map(b => (
                                        <div key={b.id} className="bg-white shadow-sm rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition-shadow">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-sm font-semibold text-gray-900">{b.resource?.name}</span>
                                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700 capitalize">
                                                        {b.resource?.type}
                                                    </span>
                                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                                        {b.status || 'confirmada'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(b.start_time)} | {formatTime(b.start_time)} - {formatTime(b.end_time)}
                                                </p>
                                                {b.purpose && <p className="text-sm text-gray-500 mt-1">{b.purpose}</p>}
                                            </div>
                                            <button
                                                onClick={() => handleCancel(b.id)}
                                                className="mt-3 sm:mt-0 text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 hover:bg-red-50 px-4 py-1.5 rounded-lg transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {past.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-500 mb-4">
                                    Pasadas ({past.length})
                                </h2>
                                <div className="space-y-3 opacity-75">
                                    {past.map(b => (
                                        <div key={b.id} className="bg-white shadow-sm rounded-xl border border-gray-100 p-5">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-sm font-semibold text-gray-700">{b.resource?.name}</span>
                                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500 capitalize">
                                                    {b.resource?.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(b.start_time)} | {formatTime(b.start_time)} - {formatTime(b.end_time)}
                                            </p>
                                            {b.purpose && <p className="text-sm text-gray-400 mt-1">{b.purpose}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
