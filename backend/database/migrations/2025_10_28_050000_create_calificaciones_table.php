<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calificaciones', function (Blueprint $table) {
            $table->id();

            // 🔗 Punto de recolección asociado
            $table->foreignId('punto_recoleccion_id')
                ->constrained('punto_recoleccions')
                ->onDelete('cascade');

            // 🔹 Evaluador (quién califica)
            $table->foreignId('evaluador_id')
                ->constrained('usuarios')
                ->onDelete('cascade');

            // 🔹 Evaluado (a quién se califica)
            $table->foreignId('evaluado_id')
                ->constrained('usuarios')
                ->onDelete('cascade');

            // 🔹 Rol del evaluador (usuario o recolector)
            $table->enum('rol_evaluador', ['usuario', 'recolector']);

            // 🌟 Puntaje (2–10, múltiplo de 2)
            $table->unsignedTinyInteger('puntaje')
                ->comment('Valor entre 2 y 10, múltiplo de 2 (estilo inDrive)');

            // 🗣️ Comentario opcional
            $table->string('comentario', 400)->nullable();

            $table->timestamps();

            // 🧩 Evitar calificaciones duplicadas por rol
            $table->unique(['punto_recoleccion_id', 'evaluador_id', 'rol_evaluador']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calificaciones');
    }
};
