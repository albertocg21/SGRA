<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\DashboardController;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Admin Resources CRUD
    Route::apiResource('resources', ResourceController::class);

    // Reservations
    Route::get('/reservas', [ReservationController::class, 'index']);
    Route::post('/reservas', [ReservationController::class, 'store']);
    Route::delete('/reservas/{reserva}', [ReservationController::class, 'destroy']);

    // Dashboard Stats (Admin)
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
});
