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
        Schema::create('empresas', function (Blueprint $table) {
            $table->id();

            // 🔗 Relación 1:1 con el usuario (recolector asociado)
            $table->unsignedBigInteger('usuario_id')->nullable();
            $table->foreign('usuario_id')
                ->references('id')
                ->on('usuarios')
                ->onDelete('cascade');

            // 🏢 Datos básicos de la empresa
            $table->string('nombre');
            $table->string('correo')->unique();
            $table->string('contacto')->nullable();

            // 🖼️ Logo institucional
            $table->string('logo')->nullable()
                ->comment('Ruta del logo institucional (almacenado en storage)');

            // 🔹 Estado activo/inactivo
            $table->boolean('activo')->default(true)
                ->comment('Define si la empresa está activa');

            // 🏷️ Categorías asociadas
            $table->json('categorias')->nullable()
                ->comment('Lista de categorías en formato JSON');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
