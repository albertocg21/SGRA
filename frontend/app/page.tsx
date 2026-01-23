'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';

export default function Home() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/reservas');
        const data = await response.json();
        setReservas(data);
      } catch (error) {
        console.error('Error fetching reservas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-3xl font-bold">SGRA - Sistema de Gestión de Reservas</h1>
      </header>

      <main className="p-8">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Reservas</h2>

          {loading ? (
            <p>Cargando...</p>
          ) : reservas.length > 0 ? (
            <div className="space-y-4">
              {/* Aquí irán las reservas */}
              <p>Total de reservas: {reservas.length}</p>
            </div>
          ) : (
            <p className="text-gray-500">No hay reservas disponibles</p>
          )}

          <Button className="mt-6">Crear Nueva Reserva</Button>
        </section>
      </main>
    </div>
  );
}
