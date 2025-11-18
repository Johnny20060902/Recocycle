<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            if (!Schema::hasColumn('usuarios', 'telefono')) {
                $table->string('telefono')->nullable()->after('apellidos');
            }

            if (!Schema::hasColumn('usuarios', 'genero')) {
                $table->string('genero')->nullable()->after('telefono');
            }

            if (!Schema::hasColumn('usuarios', 'role')) {
                $table->enum('role', ['admin', 'recolector', 'usuario'])->default('usuario')->after('password');
            }

            if (!Schema::hasColumn('usuarios', 'estado')) {
                $table->boolean('estado')->default(true)->after('role');
            }

            if (!Schema::hasColumn('usuarios', 'puntaje')) {
                $table->integer('puntaje')->default(0)->after('estado');
            }
        });
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropColumn(['telefono', 'genero', 'role', 'estado', 'puntaje']);
        });
    }
};
