'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '@/lib/axios';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

interface Resource {
    id: number;
    name: string;
    type: string;
    status: string;
}

export default function CalendarPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [selectedResource, setSelectedResource] = useState<string>('');
    const [events, setEvents] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [start, setStart] = useState<Date | null>(null);
    const [end, setEnd] = useState<Date | null>(null);
    const [purpose, setPurpose] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        api.get('/resources').then(res => setResources(res.data.filter((r: Resource) => r.status === 'active')));
        fetchBookings();
    }, []);

    const fetchBookings = () => {
        api.get('/reservas').then(res => {
            const formatted = res.data.map((b: any) => ({
                id: b.id.toString(),
                title: b.resource?.name + (b.purpose ? ' - ' + b.purpose : ''),
                start: b.start_time,
                end: b.end_time,
                resourceId: b.resource_id.toString(),
                backgroundColor: COLORS[b.resource_id % COLORS.length],
                borderColor: COLORS[b.resource_id % COLORS.length],
            }));
            setEvents(formatted);
        }).catch(err => console.error(err));
    };

    const filteredEvents = selectedResource
        ? events.filter(e => e.resourceId === selectedResource)
        : events;

    const handleDateSelect = (selectInfo: any) => {
        setError('');
        setSuccess('');
        if (!selectedResource) {
            setError('Selecciona un recurso del panel lateral antes de hacer clic en el calendario.');
            return;
        }
        setStart(selectInfo.start);
        setEnd(selectInfo.end);
        setModalOpen(true);
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await api.post('/reservas', {
                resource_id: parseInt(selectedResource),
                start_time: start?.toISOString(),
                end_time: end?.toISOString(),
                purpose
            });
            setModalOpen(false);
            setPurpose('');
            setSuccess('Reserva creada correctamente.');
            fetchBookings();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err: any) {
            const msg = err.response?.data?.errors?.resource_id?.[0]
                     || err.response?.data?.errors?.start_time?.[0]
                     || err.response?.data?.message
                     || 'Error al reservar. Puede que exista un conflicto de horario.';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const selectedResourceObj = resources.find(r => r.id.toString() === selectedResource);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Alerts */}
                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 font-bold ml-4">x</button>
                    </div>
                )}
                {success && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex justify-between items-center">
                        <span>{success}</span>
                        <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700 font-bold ml-4">x</button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar — Resource selector */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-5 sticky top-6">
                            <h2 className="text-sm font-semibold text-gray-900 mb-1">Selecciona un recurso</h2>
                            <p className="text-xs text-gray-500 mb-4">
                                Elige el recurso que quieres reservar y luego haz clic en un horario del calendario.
                            </p>
                            <div className="space-y-2">
                                <button
                                    onClick={() => setSelectedResource('')}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        selectedResource === ''
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Ver todos
                                </button>
                                {resources.map(r => (
                                    <button
                                        key={r.id}
                                        onClick={() => { setSelectedResource(r.id.toString()); setError(''); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                                            selectedResource === r.id.toString()
                                                ? 'bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-200'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span
                                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: COLORS[r.id % COLORS.length] }}
                                        />
                                        <span className="truncate">{r.name}</span>
                                        <span className="text-xs text-gray-400 capitalize ml-auto">{r.type}</span>
                                    </button>
                                ))}
                            </div>

                            {selectedResourceObj && (
                                <div className="mt-5 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">Recurso seleccionado:</p>
                                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedResourceObj.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{selectedResourceObj.type}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="flex-1 bg-white shadow-sm rounded-xl border border-gray-100 p-4 sm:p-6">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            selectable={true}
                            selectMirror={true}
                            dayMaxEvents={true}
                            weekends={false}
                            events={filteredEvents}
                            select={handleDateSelect}
                            height="auto"
                            locale="es"
                            slotMinTime="08:00:00"
                            slotMaxTime="21:00:00"
                            allDaySlot={false}
                            nowIndicator={true}
                            businessHours={{
                                daysOfWeek: [1, 2, 3, 4, 5],
                                startTime: '08:00',
                                endTime: '21:00',
                            }}
                            buttonText={{
                                today: 'Hoy',
                                month: 'Mes',
                                week: 'Semana',
                                day: 'Dia',
                            }}
                        />
                    </div>
                </div>

                {/* Booking Modal */}
                {modalOpen && (
                    <div className="fixed z-50 inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4">
                            <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={() => setModalOpen(false)} />
                            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Nueva Reserva</h3>
                                <p className="text-sm text-gray-500 mb-5">
                                    {selectedResourceObj?.name} ({selectedResourceObj?.type})
                                </p>

                                <form onSubmit={handleBooking}>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 mb-1">Inicio</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {start?.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                </p>
                                                <p className="text-lg font-bold text-indigo-600">
                                                    {start?.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-500 mb-1">Fin</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {end?.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                </p>
                                                <p className="text-lg font-bold text-indigo-600">
                                                    {end?.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Proposito de la reserva</label>
                                            <input
                                                type="text"
                                                required
                                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                value={purpose}
                                                onChange={e => setPurpose(e.target.value)}
                                                placeholder="Ej: Clase de programacion"
                                            />
                                        </div>

                                        {error && (
                                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                                {error}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
                                        >
                                            {submitting ? 'Reservando...' : 'Confirmar Reserva'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setModalOpen(false); setError(''); }}
                                            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
