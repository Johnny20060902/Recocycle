<?php

namespace App\Http\Controllers\Usuario;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;

class RankingController extends Controller
{
    /**
     * 📈 Devuelve el top de usuarios y la posición real del autenticado
     */
    public function data()
    {
        // 🔹 Obtener el top 10 de usuarios con mayor puntaje
        $ranking = Usuario::where('role', 'usuario')
            ->orderByDesc('puntaje')
            ->take(10)
            ->get(['id', 'nombres', 'apellidos', 'puntaje', 'estado']);

        // 🔹 Calcular la posición del usuario logueado
        $user = auth()->user();
        $posicion = Usuario::where('role', 'usuario')
            ->where('puntaje', '>', $user->puntaje)
            ->count() + 1;

        return response()->json([
            'ranking' => $ranking,
            'userRank' => [
                'posicion' => $posicion,
                'puntaje'  => $user->puntaje,
            ],
        ]);
    }
}
