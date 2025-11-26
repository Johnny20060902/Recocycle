<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('punto_recoleccions', function (Blueprint $table) {
            // Estado de la solicitud
            if (!Schema::hasColumn('punto_recoleccions', 'solicitud_estado')) {
                $table->string('solicitud_estado')->nullable();
            } else {
                $table->string('solicitud_estado')->nullable()->change();
            }

            // Fecha solicitada
            if (!Schema::hasColumn('punto_recoleccions', 'solicitud_fecha')) {
                $table->date('solicitud_fecha')->nullable();
            } else {
                $table->date('solicitud_fecha')->nullable()->change();
            }

            // Hora desde
            if (!Schema::hasColumn('punto_recoleccions', 'solicitud_hora_desde')) {
                $table->time('solicitud_hora_desde')->nullable();
            } else {
                $table->time('solicitud_hora_desde')->nullable()->change();
            }

            // Hora hasta
            if (!Schema::hasColumn('punto_recoleccions', 'solicitud_hora_hasta')) {
                $table->time('solicitud_hora_hasta')->nullable();
            } else {
                $table->time('solicitud_hora_hasta')->nullable()->change();
            }

            // Foto final del recolector
            if (!Schema::hasColumn('punto_recoleccions', 'foto_final')) {
                $table->string('foto_final')->nullable();
            }
        });
    }

    public function down()
    {
        // No borrar nada
    }
};
