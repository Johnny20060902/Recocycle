<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();

            // 👤 Datos personales
            $table->string('nombres');
            $table->string('apellidos');
            $table->string('telefono')->nullable();
            $table->string('genero')->nullable();

            // 📧 Credenciales
            $table->string('email')->unique();
            $table->string('password');

            // 🖼️ Foto personal del usuario (recolector/usuario/admin)
            $table->string('foto_url')->nullable()
                ->comment('Ruta o URL de la foto de perfil del usuario');

            // 🔹 Rol del usuario
            $table->enum('role', ['admin', 'recolector', 'usuario'])
                ->default('usuario')
                ->comment('Rol o tipo de cuenta dentro del sistema');

            // 🔹 Estado del usuario (string)
            $table->enum('estado', ['activo', 'inactivo', 'pendiente'])
                ->default('activo')
                ->comment('Estado del usuario dentro del sistema');

            // 💰 Puntos ecológicos o de actividad
            $table->unsignedInteger('puntaje')->default(0)
                ->comment('Puntos acumulados por reciclaje o acciones ecológicas');

            // 🌟 Reputación promedio (escala 0–10)
            $table->decimal('rating_promedio', 4, 2)->default(0.00)
                ->comment('Promedio de calificación del usuario (escala 0–10)');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
