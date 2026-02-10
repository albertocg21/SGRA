'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';

export default function ResourcesPage() {
    const [resources, setResources] = useState<any[]>([]);
    const [newItem, setNewItem] = useState({ name: '', type: 'aula', status: 'active' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = () => {
        api.get('/resources')
            .then(res => setResources(res.data))
            .catch(err => console.error(err));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/resources', newItem);
            setNewItem({ name: '', type: 'aula', status: 'active' });
            fetchResources();
        } catch (error) {
            console.error(error);
            alert('Error al crear recurso');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro?')) return;
        try {
            await api.delete(`/resources/${id}`);
            fetchResources();
        } catch (error) {
            console.error(error);
            alert('Error al eliminar');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Recursos</h1>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Form Creation */}
                <div className="bg-white shadow sm:rounded-lg mb-6 p-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Añadir Nuevo Recurso</h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 sm:grid-cols-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                value={newItem.name}
                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select
                                value={newItem.type}
                                onChange={e => setNewItem({ ...newItem, type: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                <option value="aula">Aula</option>
                                <option value="material">Material</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Estado</label>
                            <select
                                value={newItem.status}
                                onChange={e => setNewItem({ ...newItem, status: e.target.value })}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                <option value="active">Activo</option>
                                <option value="maintenance">Mantenimiento</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Guardando...' : 'Añadir'}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Acciones</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {resources.map((resource) => (
                                            <tr key={resource.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{resource.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${resource.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {resource.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => handleDelete(resource.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
