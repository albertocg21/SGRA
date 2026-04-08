'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

const emptyForm = { name: '', email: '', password: '', role: 'profesor' };

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        api.get('/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error(err));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const payload: any = { ...form };
            if (editingId && !payload.password) {
                delete payload.password;
            }

            if (editingId) {
                await api.put(`/users/${editingId}`, payload);
                setSuccess('Usuario actualizado correctamente.');
            } else {
                await api.post('/users', payload);
                setSuccess('Usuario creado correctamente.');
            }
            setForm(emptyForm);
            setEditingId(null);
            fetchUsers();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err: any) {
            const errors = err.response?.data?.errors;
            if (errors) {
                setError(Object.values(errors).flat().join(' '));
            } else {
                setError(err.response?.data?.message || 'Error al guardar usuario');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (u: User) => {
        setEditingId(u.id);
        setForm({
            name: u.name,
            email: u.email,
            password: '',
            role: u.role,
        });
        setError('');
        setSuccess('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (u: User) => {
        if (!confirm(`Eliminar al usuario "${u.name}"? Esta accion no se puede deshacer.`)) return;
        try {
            await api.delete(`/users/${u.id}`);
            setSuccess('Usuario eliminado.');
            fetchUsers();
            setTimeout(() => setSuccess(''), 4000);
        } catch (err: any) {
            const msg = err.response?.data?.errors?.user?.[0] || err.response?.data?.message || 'Error al eliminar';
            setError(msg);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(emptyForm);
        setError('');
    };

    const roleLabel = (role: string) => {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'profesor': return 'Profesor';
            case 'tic': return 'Coordinador TIC';
            default: return role;
        }
    };

    const roleBadge = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'tic': return 'bg-blue-100 text-blue-800';
            default: return 'bg-green-100 text-green-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">Gestion de Usuarios</h1>
                    <p className="text-sm text-gray-500 mt-1">Administra las cuentas de profesores y coordinadores</p>
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
                        {editingId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Nombre completo"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="usuario@sgra.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {editingId ? 'Contraseña (opcional)' : 'Contraseña'}
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required={!editingId}
                                minLength={6}
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={editingId ? 'Sin cambios' : 'Mínimo 6 caracteres'}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                            <select
                                value={form.role}
                                onChange={e => setForm({ ...form, role: e.target.value })}
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="profesor">Profesor</option>
                                <option value="tic">Coordinador TIC</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-4 flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50 transition-colors"
                            >
                                {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Usuario'}
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
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registro</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleBadge(u.role)}`}>
                                            {roleLabel(u.role)}
                                        </span>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                        {new Date(u.created_at).toLocaleDateString('es-ES')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                                        <button
                                            onClick={() => handleEdit(u)}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u)}
                                            className="text-red-600 hover:text-red-800 font-medium transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                        No hay usuarios registrados
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
