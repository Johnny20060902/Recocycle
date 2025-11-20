<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('punto_recoleccions', function (Blueprint $table) {
            $table->id();

            // 🔗 Usuario dueño del punto de recolección
            $table->foreignId('usuario_id')
                ->constrained('usuarios')
                ->onDelete('cascade');

            // 🔗 Relación con reciclaje (si el usuario ya subió fotos)
            $table->foreignId('reciclaje_id')
                ->nullable()
                ->constrained('reciclajes')
                ->onDelete('cascade');

            // 🔗 Recolector asignado al punto
            $table->foreignId('recolector_id')
                ->nullable()
                ->constrained('usuarios')
                ->nullOnDelete();

            // 📍 Ubicación geográfica
            $table->decimal('latitud', 10, 7);
            $table->decimal('longitud', 10, 7);

            // ♻️ Datos del reciclaje
            $table->string('material');
            $table->decimal('peso', 8, 2)->nullable();
            $table->text('descripcion')->nullable();

            // 📸 Foto final subida por el recolector
            $table->string('foto_final')->nullable();

            // 🗓️ Fechas que maneja el usuario
            $table->date('fecha')->nullable();
            $table->date('fecha_disponible')->nullable();
            $table->time('hora_desde')->nullable();
            $table->time('hora_hasta')->nullable();

            // 🚚 Flujo principal
            $table->enum('estado', [
                'pendiente',    // creado por usuario
                'asignado',     // recolector aceptó
                'en_camino',    // recolector va hacia el punto
                'recogido',     // material recogido
                'completado',   // proceso finalizado
                'cancelado'
            ])->default('pendiente')->index();

            // 🕒 Tiempos de transición
            $table->timestamp('aceptado_at')->nullable();
            $table->timestamp('recogido_at')->nullable();
            $table->timestamp('completado_at')->nullable();

            // 🔢 Código único por punto
            $table->string('codigo', 20)->nullable()->unique();

            // 📨 Solicitud de recolector → usuario
            $table->enum('solicitud_estado', [
                'pendiente',
                'aceptada',
                'rechazada'
            ])->default('pendiente');

            $table->date('solicitud_fecha')->nullable();
            $table->time('solicitud_hora_desde')->nullable();
            $table->time('solicitud_hora_hasta')->nullable();

            // ⭐ NUEVO: evita calificaciones duplicadas
            $table->boolean('ya_califique')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('punto_recoleccions');
    }
};
