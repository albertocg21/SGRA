<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Recurso;
use App\Models\Reserva;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@sgra.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Teacher
        $teacher = User::factory()->create([
            'name' => 'Teacher User',
            'email' => 'teacher@sgra.com',
            'password' => bcrypt('password'),
            'role' => 'profesor',
        ]);

        // TIC Coordinator
        $tic = User::factory()->create([
            'name' => 'TIC Coordinator',
            'email' => 'tic@sgra.com',
            'password' => bcrypt('password'),
            'role' => 'tic',
        ]);

        // Resources
        $aula101 = Recurso::create([
            'name' => 'Aula 101',
            'description' => 'Aula de Informática',
            'type' => 'aula',
            'capacity' => 30,
            'location' => 'Planta 1',
            'status' => 'active',
        ]);

        $aula202 = Recurso::create([
            'name' => 'Aula 202',
            'description' => 'Aula multimedia',
            'type' => 'aula',
            'capacity' => 25,
            'location' => 'Planta 2',
            'status' => 'active',
        ]);

        $labFisica = Recurso::create([
            'name' => 'Laboratorio de Física',
            'description' => 'Laboratorio con equipamiento experimental',
            'type' => 'laboratorio',
            'capacity' => 20,
            'location' => 'Planta baja',
            'status' => 'active',
        ]);

        Recurso::create([
            'name' => 'Proyector A',
            'description' => 'Proyector portátil Epson',
            'type' => 'material',
            'status' => 'active',
        ]);

        Recurso::create([
            'name' => 'Kit VR',
            'description' => 'Gafas de realidad virtual Meta Quest',
            'type' => 'equipo',
            'status' => 'active',
        ]);

        Recurso::create([
            'name' => 'Sala de Actos',
            'description' => 'Sala principal para eventos y conferencias',
            'type' => 'aula',
            'capacity' => 150,
            'location' => 'Planta baja',
            'status' => 'maintenance',
        ]);

        // Sample reservations for demo
        $nextMonday = Carbon::now()->next(Carbon::MONDAY);

        Reserva::create([
            'user_id' => $teacher->id,
            'resource_id' => $aula101->id,
            'start_time' => $nextMonday->copy()->setTime(9, 0),
            'end_time' => $nextMonday->copy()->setTime(11, 0),
            'status' => 'confirmed',
            'purpose' => 'Clase de Programación Web',
        ]);

        Reserva::create([
            'user_id' => $teacher->id,
            'resource_id' => $aula202->id,
            'start_time' => $nextMonday->copy()->setTime(12, 0),
            'end_time' => $nextMonday->copy()->setTime(14, 0),
            'status' => 'confirmed',
            'purpose' => 'Taller de React',
        ]);

        Reserva::create([
            'user_id' => $tic->id,
            'resource_id' => $labFisica->id,
            'start_time' => $nextMonday->copy()->addDay()->setTime(10, 0),
            'end_time' => $nextMonday->copy()->addDay()->setTime(12, 0),
            'status' => 'confirmed',
            'purpose' => 'Mantenimiento equipos',
        ]);

        Reserva::create([
            'user_id' => $admin->id,
            'resource_id' => $aula101->id,
            'start_time' => $nextMonday->copy()->addDays(2)->setTime(15, 0),
            'end_time' => $nextMonday->copy()->addDays(2)->setTime(17, 0),
            'status' => 'confirmed',
            'purpose' => 'Reunión de departamento',
        ]);
    }
}
