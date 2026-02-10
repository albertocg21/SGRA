<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reserva;
use Illuminate\Validation\ValidationException;

class ReservationController extends Controller
{
    public function index()
    {
        return Reserva::with(['user:id,name', 'recurso:id,name'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resource_id' => 'required|exists:recursos,id',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
            'purpose' => 'nullable|string',
        ]);

        // Conflict detection
        $exists = Reserva::where('resource_id', $validated['resource_id'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                    ->orWhere(function ($q) use ($validated) {
                        $q->where('start_time', '<', $validated['start_time'])
                            ->where('end_time', '>', $validated['end_time']);
                    });
            })
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'resource_id' => ['El recurso ya está reservado en ese horario.'],
            ]);
        }

        $reserva = $request->user()->reservas()->create($validated);

        return response()->json($reserva, 201);
    }

    public function destroy(Request $request, Reserva $reserva)
    {
        if ($request->user()->id !== $reserva->user_id && $request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $reserva->delete();
        return response()->json(null, 204);
    }
}
