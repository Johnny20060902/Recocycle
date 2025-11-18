<?php

namespace App\Http\Controllers\Recolector;

use App\Http\Controllers\Controller;
use App\Models\PuntoRecoleccion;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * 📊 Retorna datos reales del recolector para el dashboard
     */
    public function data()
    {
        $user = auth()->user();

        // 🟢 Total de recolecciones completadas
        $completados = PuntoRecoleccion::where('recolector_id', $user->id)
            ->where('estado', 'completado')
            ->count();

        // 📈 Progreso semanal (conteo por día)
        $progresoSemanal = collect(range(0, 6))->map(function ($i) use ($user) {
            return PuntoRecoleccion::where('recolector_id', $user->id)
                ->where('estado', 'completado')
                ->whereBetween('created_at', [
                    now()->startOfWeek()->addDays($i),
                    now()->startOfWeek()->addDays($i + 1),
                ])
                ->count();
        });

        return response()->json([
            'completados' => $completados,
            'puntaje'     => $user->puntaje,
            'rating'      => $user->rating_promedio,
            'progresoSemanal' => $progresoSemanal,
        ]);
    }
}
