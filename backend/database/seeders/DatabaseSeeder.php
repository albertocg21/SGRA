<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@sgra.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Teacher
        User::factory()->create([
            'name' => 'Teacher User',
            'email' => 'teacher@sgra.com',
            'password' => bcrypt('password'),
            'role' => 'profesor',
        ]);

        // Resources
        \App\Models\Recurso::create([
            'name' => 'Aula 101',
            'description' => 'Aula de Informática',
            'type' => 'aula',
            'capacity' => 30,
            'location' => 'Planta 1',
            'status' => 'active',
        ]);

        \App\Models\Recurso::create([
            'name' => 'Proyector A',
            'description' => 'Proyector portátil Epson',
            'type' => 'material',
            'status' => 'active',
        ]);
    }
}
