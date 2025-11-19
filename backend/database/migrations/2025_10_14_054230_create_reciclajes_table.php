<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reciclajes', function (Blueprint $table) {
            $table->id();

            // 🔗 Relaciones
            $table->foreignId('usuario_id')
                ->constrained('usuarios')
                ->onDelete('cascade');

            $table->foreignId('categoria_id')
                ->constrained('categorias')
                ->onDelete('restrict');

            // 📋 Descripción
            $table->text('descripcion')->nullable();

            // 📅 Fechas y horarios (almacenadas como JSON)
            $table->json('registros')->nullable();

            // 📍 Ubicación
            $table->decimal('latitud', 10, 7)->nullable();
            $table->decimal('longitud', 10, 7)->nullable();

            // 📁 Imágenes (URLs subidas o locales)
            $table->json('imagenes_url')->nullable();

            // ⚙️ Estado del reciclaje
            $table->enum('estado', [
                'pendiente',
                'aceptado',
                'asignado',
                'completado',
                'cancelado'
            ])->default('pendiente');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reciclajes');
    }
};
