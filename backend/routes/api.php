<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/reservas', function () {
    return response()->json([
        // Devolvemos un array vacío o datos de prueba para evitar el error de sintaxis en el frontend
        // al intentar parsear HTML como JSON.
        ['id' => 1, 'cliente' => 'Cliente de Prueba', 'fecha' => now()->toDateTimeString()],
    ]);
});
