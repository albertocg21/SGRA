<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Recurso;
use App\Models\Reserva;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'users' => User::count(),
            'resources' => Recurso::count(),
            'reservas_today' => Reserva::whereDate('start_time', now())->count(),
        ]);
    }
}
