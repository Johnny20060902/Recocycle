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
        Schema::create('recolecciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recolector_id')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('reciclaje_id')->constrained('reciclajes')->onDelete('cascade');
            $table->decimal('peso_kg', 8, 2)->nullable();
            $table->text('observaciones')->nullable();
            $table->date('fecha_recoleccion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recolecciones');
    }
};
