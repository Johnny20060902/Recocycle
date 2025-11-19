<?php

namespace App\Http\Controllers;

use App\Models\SolicitudRecoleccion;
use App\Models\PuntoRecoleccion;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use App\Notifications\SolicitudRecoleccionNotificacion;

class SolicitudRecoleccionController extends Controller
{
    /**
     * 📩 Enviar solicitud del recolector al usuario
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'punto_id' => 'required|exists:punto_recoleccions,id',
            'usuario_id' => 'required|exists:usuarios,id',
            'fecha_solicitada' => 'required|date',
            'hora_solicitada' => 'required',
        ]);

        $usuario = Usuario::find($validated['usuario_id']);

        // ⚠️ Solo permitir solicitudes a usuarios finales
        if (!$usuario || $usuario->role !== 'usuario') {
            return response()->json([
                'success' => false,
                'message' => 'Solo se pueden enviar solicitudes a usuarios finales.',
            ], 403);
        }

        // Verificar si ya existe una solicitud pendiente entre ambos
        $existe = SolicitudRecoleccion::where('punto_id', $validated['punto_id'])
            ->where('recolector_id', Auth::id())
            ->where('estado', 'pendiente')
            ->first();

        if ($existe) {
            return response()->json([
                'success' => false,
                'message' => 'Ya enviaste una solicitud pendiente para este punto.',
            ]);
        }

        $solicitud = SolicitudRecoleccion::create([
            'punto_id' => $validated['punto_id'],
            'recolector_id' => Auth::id(),
            'usuario_id' => $validated['usuario_id'],
            'fecha_solicitada' => $validated['fecha_solicitada'],
            'hora_solicitada' => $validated['hora_solicitada'],
            'estado' => 'pendiente',
        ]);

        // 🔔 Notificación interna al usuario
        Notification::send($usuario, new SolicitudRecoleccionNotificacion($solicitud));

        return response()->json([
            'success' => true,
            'message' => 'Solicitud enviada correctamente al usuario.',
            'solicitud' => $solicitud,
        ]);
    }

    /**
     * ✅ Aceptar solicitud (solo el usuario puede hacerlo)
     */
    public function aceptar($id)
    {
        $solicitud = SolicitudRecoleccion::findOrFail($id);

        if (Auth::id() !== $solicitud->usuario_id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $solicitud->update(['estado' => 'aceptada']);

        // ✅ Cambiar estado del punto asociado
        $punto = $solicitud->punto;
        if ($punto) {
            $punto->update(['estado' => 'confirmado']);
        }


        return response()->json([
            'success' => true,
            'message' => 'Solicitud aceptada. El recolector será notificado.',
        ]);
    }

    /**
     * ❌ Rechazar solicitud (solo el usuario puede hacerlo)
     */
    public function rechazar($id)
    {
        $solicitud = SolicitudRecoleccion::findOrFail($id);

        if (Auth::id() !== $solicitud->usuario_id) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $solicitud->update(['estado' => 'rechazada']);

        return response()->json([
            'success' => true,
            'message' => 'Solicitud rechazada correctamente.',
        ]);
    }

    /**
     * 📋 Listar solicitudes (dependiendo del rol)
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'recolector') {
            $solicitudes = SolicitudRecoleccion::with(['usuario', 'punto'])
                ->where('recolector_id', $user->id)
                ->latest()
                ->get();
        } elseif ($user->role === 'usuario') {
            $solicitudes = SolicitudRecoleccion::with(['recolector', 'punto'])
                ->where('usuario_id', $user->id)
                ->latest()
                ->get();
        } else {
            $solicitudes = collect(); // vacío para admins
        }

        return response()->json($solicitudes);
    }
}
