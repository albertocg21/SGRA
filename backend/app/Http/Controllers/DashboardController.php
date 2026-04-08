<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Recurso;
use App\Models\Reserva;
use App\Models\AuditLog;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        // Basic counts
        $users = User::count();
        $resources = Recurso::count();
        $reservasToday = Reserva::whereDate('start_time', now())->count();
        $totalReservas = Reserva::count();

        // Reservations per resource type (for pie chart)
        $byResourceType = Recurso::withCount('reservas')
            ->get()
            ->groupBy('type')
            ->map(function ($group) {
                return $group->sum('reservas_count');
            });

        // Reservations per day of the week (for bar chart)
        $weeklyData = [];
        $days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        for ($i = 1; $i <= 7; $i++) {
            $weeklyData[] = Reserva::whereRaw("strftime('%w', start_time) = ?", [$i % 7])->count();
        }

        // Recent audit logs
        $recentLogs = AuditLog::with('user:id,name')
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'user' => $log->user->name ?? 'Sistema',
                    'action' => $log->action,
                    'created_at' => $log->created_at->format('d/m/Y H:i'),
                ];
            });

        // Most used resources (top 5)
        $topResources = Recurso::withCount('reservas')
            ->orderByDesc('reservas_count')
            ->take(5)
            ->get()
            ->map(function ($r) {
                return ['name' => $r->name, 'count' => $r->reservas_count];
            });

        return response()->json([
            'users' => $users,
            'resources' => $resources,
            'reservas_today' => $reservasToday,
            'total_reservas' => $totalReservas,
            'by_resource_type' => $byResourceType,
            'weekly_data' => $weeklyData,
            'weekly_labels' => $days,
            'recent_logs' => $recentLogs,
            'top_resources' => $topResources,
        ]);
    }
}
