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
            ->where('usuarios.estado', 'activo') // ✅ valor correcto del campo
            ->leftJoin('empresas', 'usuarios.id', '=', 'empresas.usuario_id')
            ->select(
                'usuarios.id',
                'usuarios.nombres',
                'usuarios.apellidos',
                'usuarios.email',
                'usuarios.puntaje',
                'usuarios.foto_url',
                'usuarios.rating_promedio',
                'empresas.logo as empresa_logo'
            )
            ->orderByDesc('usuarios.puntaje')
            ->get()
            ->map(function ($r) {
                /** -------------------------
                 * 🟩 CANTIDAD DE RECOLECCIONES
                 * ------------------------- */
                $r->recolecciones = DB::table('punto_recoleccions')
                    ->where('recolector_id', $r->id)
                    ->where('estado', 'completado')
                    ->count();

                /** -------------------------
                 * 🖼️ FOTO DEL RECOLECTOR
                 * ------------------------- */
                if ($r->foto_url) {
                    $r->imagen = asset('storage/' . $r->foto_url);
                } elseif ($r->empresa_logo) {
                    $r->imagen = asset('storage/' . $r->empresa_logo);
                } else {
                    $r->imagen = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                }

                return $r;
            });

        return response()->json([
            'ok'           => true,
            'recolectores' => $recolectores,
        ]);
    }
}
