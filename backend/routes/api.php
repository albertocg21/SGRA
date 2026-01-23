<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/reservas', function () {
    return response()->json([
        ['id' => 1, 'descripcion' => 'Reserva Sala A'],
        ['id' => 2, 'descripcion' => 'Reserva Proyector'],
        ['id' => 3, 'descripcion' => 'Reserva Portátil']
    ]);
});
