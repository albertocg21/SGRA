<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Recurso;

class ResourceController extends Controller
{
    public function index()
    {
        return Recurso::all();
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'capacity' => 'nullable|integer',
            'location' => 'nullable|string',
            'status' => 'required|in:active,maintenance',
        ]);

        $recurso = Recurso::create($validated);
        return response()->json($recurso, 201);
    }

    public function show(Recurso $resource)
    {
        return $resource;
    }

    public function update(Request $request, Recurso $resource)
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'type' => 'string',
            'capacity' => 'nullable|integer',
            'location' => 'nullable|string',
            'status' => 'in:active,maintenance',
        ]);

        $resource->update($validated);
        return response()->json($resource);
    }

    public function destroy(Request $request, Recurso $resource)
    {
        $this->authorizeAdmin($request);
        $resource->delete();
        return response()->json(null, 204);
    }

    private function authorizeAdmin(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
    }
}
