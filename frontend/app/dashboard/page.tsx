'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';

/* ── SVG Bar Chart ── */
function BarChart({ labels, data }: { labels: string[]; data: number[] }) {
    const maxVal = Math.max(...data, 1);
    const barW = 36;
    const gap = 12;
    const chartH = 180;
    const totalW = labels.length * (barW + gap);

    return (
        <svg viewBox={`0 0 ${totalW + 40} ${chartH + 40}`} className="w-full" style={{ maxHeight: 260 }}>
            {/* grid */}
            {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
                const y = 10 + chartH * (1 - f);
                return <line key={i} x1="30" y1={y} x2={totalW + 30} y2={y} stroke="#e5e7eb" strokeWidth="1" />;
            })}
            {data.map((val, i) => {
                const barH = (val / maxVal) * chartH;
                const x = 34 + i * (barW + gap);
                const y = 10 + chartH - barH;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={barW} height={barH} rx="4" fill="url(#barGrad)" />
                        <text x={x + barW / 2} y={y - 6} textAnchor="middle" className="text-xs" fill="#374151" fontSize="11">{val}</text>
                        <text x={x + barW / 2} y={chartH + 26} textAnchor="middle" fill="#6b7280" fontSize="10">{labels[i]}</text>
                    </g>
                );
            })}
            <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a5b4fc" />
                </linearGradient>
            </defs>
        </svg>
    );
}

/* ── SVG Donut Chart ── */
function DonutChart({ labels, data, colors }: { labels: string[]; data: number[]; colors: string[] }) {
    const total = data.reduce((a, b) => a + b, 0) || 1;
    const cx = 90, cy = 90, r = 70, inner = 45;
    let cumulative = 0;

    const slices = data.map((val, i) => {
        const start = cumulative;
        cumulative += val;
        const startAngle = (start / total) * 360 - 90;
        const endAngle = (cumulative / total) * 360 - 90;
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const x1 = cx + r * Math.cos(toRad(startAngle));
        const y1 = cy + r * Math.sin(toRad(startAngle));
        const x2 = cx + r * Math.cos(toRad(endAngle));
        const y2 = cy + r * Math.sin(toRad(endAngle));
        const ix1 = cx + inner * Math.cos(toRad(endAngle));
        const iy1 = cy + inner * Math.sin(toRad(endAngle));
        const ix2 = cx + inner * Math.cos(toRad(startAngle));
        const iy2 = cy + inner * Math.sin(toRad(startAngle));

        const d = [
            `M ${x1} ${y1}`,
            `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L ${ix1} ${iy1}`,
            `A ${inner} ${inner} 0 ${largeArc} 0 ${ix2} ${iy2}`,
            'Z',
        ].join(' ');

        return <path key={i} d={d} fill={colors[i % colors.length]} />;
    });

    return (
        <div className="flex items-center gap-6">
            <svg viewBox="0 0 180 180" className="w-40 h-40 flex-shrink-0">
                {slices}
                <text x={cx} y={cy - 4} textAnchor="middle" fill="#1f2937" fontSize="22" fontWeight="bold">{total}</text>
                <text x={cx} y={cy + 14} textAnchor="middle" fill="#6b7280" fontSize="11">Total</text>
            </svg>
            <div className="space-y-2">
                {labels.map((label, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                        <span className="text-sm text-gray-700 capitalize">{label}</span>
                        <span className="text-sm font-semibold text-gray-900">{data[i]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface Stats {
    users: number;
    resources: number;
    reservas_today: number;
    total_reservas: number;
    by_resource_type: Record<string, number>;
    weekly_data: number[];
    weekly_labels: string[];
    recent_logs: { id: number; user: string; action: string; created_at: string }[];
    top_resources: { name: string; count: number }[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        api.get('/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err));
    }, []);

    if (!stats) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    const statCards = [
        { label: 'Usuarios', value: stats.users, color: 'bg-blue-500' },
        { label: 'Recursos', value: stats.resources, color: 'bg-emerald-500' },
        { label: 'Reservas Hoy', value: stats.reservas_today, color: 'bg-violet-500' },
        { label: 'Total Reservas', value: stats.total_reservas, color: 'bg-amber-500' },
    ];

    const typeLabels = Object.keys(stats.by_resource_type || {});
    const typeData = Object.values(stats.by_resource_type || {});
    const pieColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Panel de administracion del sistema</p>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {statCards.map(card => (
                        <div key={card.label} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="px-5 py-5">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 ${card.color} rounded-lg w-12 h-12 flex items-center justify-center`}>
                                        <span className="text-white text-lg font-bold">{card.value}</span>
                                    </div>
                                    <div className="ml-4">
                                        <dt className="text-sm font-medium text-gray-500">{card.label}</dt>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservas por Dia de la Semana</h3>
                        <BarChart
                            labels={stats.weekly_labels || []}
                            data={stats.weekly_data || []}
                        />
                    </div>
                    <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservas por Tipo de Recurso</h3>
                        {typeLabels.length > 0 ? (
                            <div className="flex items-center justify-center py-4">
                                <DonutChart labels={typeLabels} data={typeData} colors={pieColors} />
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-10">No hay datos disponibles</p>
                        )}
                    </div>
                </div>

                {/* Top Resources + Audit Log */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recursos Mas Usados</h3>
                        {stats.top_resources?.length > 0 ? (
                            <div className="space-y-3">
                                {stats.top_resources.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-700">{r.name}</span>
                                        <div className="flex items-center">
                                            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-3">
                                                <div
                                                    className="bg-indigo-500 h-2.5 rounded-full transition-all"
                                                    style={{ width: `${Math.min(100, (r.count / (stats.top_resources[0]?.count || 1)) * 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900 w-8 text-right">{r.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-10">Sin reservas aun</p>
                        )}
                    </div>

                    <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Registro de Auditoria</h3>
                        {stats.recent_logs?.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {stats.recent_logs.map(log => (
                                    <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div>
                                            <span className="text-sm font-medium text-gray-800">{log.user}</span>
                                            <span className="text-sm text-gray-500 ml-2">{log.action}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">{log.created_at}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-center py-10">Sin actividad reciente</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
