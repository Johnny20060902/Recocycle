<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('solicitudes_recoleccion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('punto_id')->constrained('punto_recoleccions')->onDelete('cascade');
            $table->foreignId('recolector_id')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->date('fecha_solicitada');
            $table->time('hora_solicitada');
            $table->enum('estado', ['pendiente', 'aceptada', 'rechazada'])->default('pendiente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('solicitudes_recoleccion');
    }
};
