<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('premios', function (Blueprint $table) {
            $table->id();

            // 🏆 Información básica
            $table->string('nombre');
            $table->date('fecha_limite');

            // 📎 Archivo o imagen del premio
            $table->string('archivo')->nullable();

            // ✅ Estado del premio (activo o inactivo)
            $table->boolean('activo')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('premios');
    }
};
