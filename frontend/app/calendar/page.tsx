'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '@/lib/axios';

export default function CalendarPage() {
    const [resources, setResources] = useState<any[]>([]);
    const [selectedResource, setSelectedResource] = useState<string>('');
    const [events, setEvents] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [start, setStart] = useState<Date | null>(null);
    const [end, setEnd] = useState<Date | null>(null);
    const [purpose, setPurpose] = useState('');

    useEffect(() => {
        api.get('/resources').then(res => setResources(res.data));
        fetchBookings();
    }, []);

    const fetchBookings = () => {
        api.get('/reservas').then(res => {
            const formatted = res.data.map((b: any) => ({
                id: b.id.toString(),
                title: `${b.resource.name} - ${b.purpose || 'Reservado'}`,
                start: b.start_time,
                end: b.end_time,
                resourceId: b.resource_id.toString(),
                backgroundColor: '#4f46e5'
            }));
            setEvents(formatted);
        });
    };

    const filteredEvents = selectedResource
        ? events.filter(e => e.resourceId === selectedResource)
        : events;

    const handleDateSelect = (selectInfo: any) => {
        if (!selectedResource) {
            alert('Por favor selecciona un recurso primero para reservar.');
            return;
        }
        setStart(selectInfo.start);
        setEnd(selectInfo.end);
        setModalOpen(true);
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/reservas', {
                resource_id: selectedResource,
                start_time: start?.toISOString(),
                end_time: end?.toISOString(),
                purpose
            });
            setModalOpen(false);
            setPurpose('');
            fetchBookings();
            alert('Reserva creada con éxito');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al reservar. Puede que haya un conflicto.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Filtrar por Recurso</label>
                        <select
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                            value={selectedResource}
                            onChange={(e) => setSelectedResource(e.target.value)}
                        >
                            <option value="">Ver todos</option>
                            {resources.map(r => (
                                <option key={r.id} value={r.id.toString()}>{r.name} ({r.type})</option>
                            ))}
                        </select>
                    </div>

                    <div className="calendar-container">
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
                            weekends={true}
                            events={filteredEvents}
                            select={handleDateSelect}
                            height="auto"
                            locale="es"
                        />
                    </div>
                </div>

                {/* Modal */}
                {modalOpen && (
                    <div className="fixed z-10 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <form onSubmit={handleBooking}>
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900">Nueva Reserva</h3>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Recurso: {resources.find(r => r.id.toString() === selectedResource)?.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Inicio: {start?.toLocaleString()}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Fin: {end?.toLocaleString()}
                                                    </p>
                                                    <div className="mt-4">
                                                        <label className="block text-sm font-medium text-gray-700">Propósito</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                            value={purpose}
                                                            onChange={e => setPurpose(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                                            Confirmar
                                        </button>
                                        <button type="button" onClick={() => setModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
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
