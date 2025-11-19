<?php

namespace App\Http\Controllers\Usuario;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsuarioController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();

        return Inertia::render('Usuario/Dashboard', [
            'auth' => [
                'user' => $user,
            ],
        ]);
    }


    public function puntos()
    {
        $user = auth()->user();

        $estadisticas = [
            'total_puntos' => $user->puntaje ?? 0,
            'nivel' => $user->puntaje >= 1000 ? 'Eco Héroe' : ($user->puntaje >= 500 ? 'Reciclador Pro' : 'Aprendiz Verde'),
            'progreso' => min(($user->puntaje / 1000) * 100, 100),
            'ranking' => rand(1, 20),
        ];

        return Inertia::render('Usuario/Puntos', [
            'auth' => $user,
            'estadisticas' => $estadisticas,
        ]);
    }
    /**
     * ✅ El usuario acepta la solicitud del recolector
     */
    public function aceptarSolicitud($id)
    {
        $punto = \App\Models\PuntoRecoleccion::findOrFail($id);

        $punto->update([
            'solicitud_estado' => 'aceptada',
            'estado' => 'asignado',
        ]);

        return response()->json([
            'ok' => true,
            'msg' => 'Solicitud aceptada correctamente.',
        ]);
    }

    /**
     * ❌ El usuario rechaza la solicitud del recolector
     */
    public function rechazarSolicitud($id)
    {
        $punto = \App\Models\PuntoRecoleccion::findOrFail($id);

        $punto->update([
            'solicitud_estado' => 'rechazada',
        ]);

        return response()->json([
            'ok' => true,
            'msg' => 'Solicitud rechazada correctamente.',
        ]);
    }
}
