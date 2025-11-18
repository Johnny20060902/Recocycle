<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\Usuario;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // 👑 ADMINISTRADOR
        Usuario::updateOrCreate(
            ['email' => 'admin@recocycle.io'],
            [
                'nombres'         => 'Administrador',
                'apellidos'       => 'Recocycle',
                'telefono'        => '70000000',
                'genero'          => 'Masculino',
                'password'        => 'Admin123*', // 🔐 se encripta automáticamente por el mutator
                'role'            => 'admin',
                'estado'          => 'activo', // ✅ ahora string
                'puntaje'         => 120,
                'rating_promedio' => 5.0,
                'created_at'      => $now,
                'updated_at'      => $now,
            ]
        );

        // 🚛 RECOLECTOR 1
        Usuario::updateOrCreate(
            ['email' => 'recolector@recocycle.io'],
            [
                'nombres'         => 'Recolector',
                'apellidos'       => 'Demo',
                'telefono'        => '71000000',
                'genero'          => 'Masculino',
                'password'        => 'Reco123*',
                'role'            => 'recolector',
                'estado'          => 'activo', // ✅
                'puntaje'         => 85,
                'rating_promedio' => 4.6,
                'created_at'      => $now,
                'updated_at'      => $now,
            ]
        );

        // 🚛 RECOLECTOR 2
        Usuario::updateOrCreate(
            ['email' => 'recolector2@recocycle.io'],
            [
                'nombres'         => 'Carlos',
                'apellidos'       => 'Vargas',
                'telefono'        => '71122334',
                'genero'          => 'Masculino',
                'password'        => 'Reco123*',
                'role'            => 'recolector',
                'estado'          => 'activo', // ✅
                'puntaje'         => 75,
                'rating_promedio' => 4.3,
                'created_at'      => $now,
                'updated_at'      => $now,
            ]
        );

        // 👤 USUARIO 1
        Usuario::updateOrCreate(
            ['email' => 'usuario@recocycle.io'],
            [
                'nombres'         => 'María',
                'apellidos'       => 'Fernández',
                'telefono'        => '72000000',
                'genero'          => 'Femenino',
                'password'        => 'User123*',
                'role'            => 'usuario',
                'estado'          => 'activo', // ✅
                'puntaje'         => 60,
                'rating_promedio' => 4.8,
                'created_at'      => $now,
                'updated_at'      => $now,
            ]
        );

        // 👤 USUARIO 2
        Usuario::updateOrCreate(
            ['email' => 'usuario2@recocycle.io'],
            [
                'nombres'         => 'Jorge',
                'apellidos'       => 'Rojas',
                'telefono'        => '72112233',
                'genero'          => 'Masculino',
                'password'        => 'User123*',
                'role'            => 'usuario',
                'estado'          => 'activo', // ✅
                'puntaje'         => 45,
                'rating_promedio' => 4.1,
                'created_at'      => $now,
                'updated_at'      => $now,
            ]
        );
    }
}
