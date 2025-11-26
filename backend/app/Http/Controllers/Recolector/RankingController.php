<?php

namespace App\Http\Controllers\Recolector;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Support\Facades\DB;

class RankingController extends Controller
{
    /**
     * 🏆 Ranking de recolectores (versión completa, final y de producción)
     */
public function data()
{
    $recolectores = Usuario::query()
        ->where('usuarios.role', 'recolector')
        ->where('usuarios.estado', 'activo')
        ->leftJoin('empresas', 'usuarios.id', '=', 'empresas.usuario_id')
        ->select(
            'usuarios.id',
            'usuarios.nombres',
            'usuarios.apellidos',
            'usuarios.email',
            'usuarios.puntaje',
            'usuarios.rating_promedio',
            'empresas.logo as empresa_logo'
        )
        ->orderByDesc('usuarios.puntaje')
        ->get()
        ->map(function ($r) {

            // ---------------------
            // FOTO FINAL
            // ---------------------
            if (!empty($r->empresa_logo)) {
                $r->foto_final = asset('storage/' . $r->empresa_logo);
            } else {
                $r->foto_final = asset('images/default-recolector.png');
            }

            // ---------------------
            // CANTIDAD DE RECOLECCIONES
            // ---------------------
            $r->recolecciones = DB::table('punto_recoleccions')
                ->where('recolector_id', $r->id)
                ->where('estado', 'completado')
                ->count();

            return $r;
        });

    return response()->json([
        'ok' => true,
        'recolectores' => $recolectores,
    ]);
}
}
