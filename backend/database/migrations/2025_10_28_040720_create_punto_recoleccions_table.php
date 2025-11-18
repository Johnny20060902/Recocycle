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

            // 🔗 Usuario que creó el punto (dueño del reciclaje)
            $table->foreignId('usuario_id')
                ->constrained('usuarios')
                ->onDelete('cascade');

            // 🔗 Relación con el reciclaje (si existe un registro previo)
            $table->foreignId('reciclaje_id')
                ->nullable()
                ->constrained('reciclajes')
                ->onDelete('cascade');

            // 🔗 Recolector asignado
            $table->foreignId('recolector_id')
                ->nullable()
                ->constrained('usuarios')
                ->nullOnDelete();

            // 📍 Coordenadas del punto
            $table->decimal('latitud', 10, 7);
            $table->decimal('longitud', 10, 7);

            // ♻️ Datos del material
            $table->string('material');
            $table->decimal('peso', 8, 2)->nullable();
            $table->text('descripcion')->nullable();

            // 📸 Foto final de la recolección (subida por el recolector)
            $table->string('foto_final')->nullable();

            // 🗓️ Fechas y horarios principales
            $table->date('fecha')->nullable();
            $table->date('fecha_disponible')->nullable();
            $table->time('hora_desde')->nullable();
            $table->time('hora_hasta')->nullable();

            // 🚚 Flujo de recolección
            $table->enum('estado', [
                'pendiente',    // creado por el usuario
                'asignado',     // aceptado por un recolector
                'en_camino',    // recolector en camino
                'recogido',     // material recogido
                'completado',   // proceso finalizado
                'cancelado'     // cancelado
            ])->default('pendiente')->index();

            // 📆 Tiempos de transición
            $table->timestamp('aceptado_at')->nullable();
            $table->timestamp('recogido_at')->nullable();
            $table->timestamp('completado_at')->nullable();

            // 🔢 Código único para rastreo
            $table->string('codigo', 20)->nullable()->unique();

            // 📨 Campos del flujo de solicitud
            $table->enum('solicitud_estado', [
                'pendiente',    // enviada por el recolector
                'aceptada',     // usuario la acepta
                'rechazada'     // usuario la rechaza
            ])->default('pendiente');

            $table->date('solicitud_fecha')->nullable();       // fecha elegida por el recolector
            $table->time('solicitud_hora_desde')->nullable();  // rango de hora
            $table->time('solicitud_hora_hasta')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('punto_recoleccions');
    }
};
