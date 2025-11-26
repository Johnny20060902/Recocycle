<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('categoria_empresa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empresa_id')->constrained('empresas')->onDelete('cascade');
            $table->foreignId('categoria_id')->constrained('categorias')->onDelete('cascade');
            $table->timestamps();
        });

        // Opcional: eliminar columna antigua (solo si quieres dejarlo limpio)
        Schema::table('empresas', function (Blueprint $table) {
            if (Schema::hasColumn('empresas', 'categorias')) {
                $table->dropColumn('categorias');
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categoria_empresa');
    }
};
