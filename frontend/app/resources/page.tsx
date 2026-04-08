'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';

interface Resource {
    id: number;
    name: string;
    description: string | null;
    type: string;
    capacity: number | null;
    location: string | null;
    status: string;
}

const emptyForm = { name: '', description: '', type: 'aula', capacity: '', location: '', status: 'active' };

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = () => {
        api.get('/resources')
            .then(res => setResources(res.data))
            .catch(err => console.error(err));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const payload = {
                ...form,
                capacity: form.capacity ? parseInt(form.capacity) : null,
            };

            if (editingId) {
                await api.put(`/resources/${editingId}`, payload);
                setSuccess('Recurso actualizado correctamente.');
            } else {
                await api.post('/resources', payload);
                setSuccess('Recurso creado correctamente.');
            }
            setForm(emptyForm);
            setEditingId(null);
            fetchResources();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al guardar recurso');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (r: Resource) => {
        setEditingId(r.id);
        setForm({
            name: r.name,
            description: r.description || '',
            type: r.type,
            capacity: r.capacity?.toString() || '',
            location: r.location || '',
            status: r.status,
        });
        setError('');
        setSuccess('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Seguro que quieres eliminar este recurso?')) return;
        try {
            await api.delete(`/resources/${id}`);
            setSuccess('Recurso eliminado.');
            fetchResources();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al eliminar');
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
        setError('');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">Gestion de Recursos</h1>
                    <p className="text-sm text-gray-500 mt-1">Administra aulas, materiales y equipamiento</p>
                </div>
            </header>
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

                {/* Form */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-100 mb-6 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingId ? 'Editar Recurso' : 'Nuevo Recurso'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Ej: Aula 201"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
                            <input
                                type="text"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Ej: Sala de informatica"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="aula">Aula</option>
                                <option value="material">Material</option>
                                <option value="laboratorio">Laboratorio</option>
                                <option value="equipo">Equipo</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                            <input
                                type="number"
                                value={form.capacity}
                                onChange={e => setForm({ ...form, capacity: e.target.value })}
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Ej: 30"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicacion</label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })}
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Ej: Planta 2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select
                                value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value })}
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="active">Activo</option>
                                <option value="maintenance">En Mantenimiento</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Recurso'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacidad</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ubicacion</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {resources.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{r.name}</div>
                                        {r.description && <div className="text-xs text-gray-500">{r.description}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-700 capitalize">
                                            {r.type}
                                        </span>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {r.capacity || '—'}
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {r.location || '—'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            r.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {r.status === 'active' ? 'Activo' : 'Mantenimiento'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                                        <button
                                            onClick={() => handleEdit(r)}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(r.id)}
                                            className="text-red-600 hover:text-red-800 font-medium transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {resources.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                        No hay recursos registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
