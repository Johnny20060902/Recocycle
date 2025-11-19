<?php

namespace App\Http\Controllers\Recolector;

use App\Http\Controllers\Controller;
use App\Models\PuntoRecoleccion;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FlujoRecoleccionController extends Controller
{
    /**
     * 📦 Controla todo el flujo entre recolector y usuario:
     * solicitudes, aceptación, recolección y calificación.
     */

    // ============================================================
    // 🔹 1️⃣ SOLICITUD DE RECOLECCIÓN
    // ============================================================

    /**
     * 📨 Recolector envía solicitud al usuario (selecciona fecha y hora)
     */
    public function solicitar(Request $request, PuntoRecoleccion $punto)
    {
        $request->validate([
            'fecha' => 'required|date',
            'hora_desde' => 'nullable|string',
            'hora_hasta' => 'nullable|string',
        ]);

        $recolector = auth()->user();

        // 🔒 Si ya está tomada por otro recolector
        if (
            $punto->solicitud_estado === 'pendiente' &&
            $punto->recolector_id !== null &&
            $punto->recolector_id !== $recolector->id
        ) {
            return $this->respondError('Ya existe una solicitud pendiente de otro recolector.');
        }

        // 💡 Si quedó "pendiente" sin recolector, lo limpiamos automáticamente
        if ($punto->solicitud_estado === 'pendiente' && $punto->recolector_id === null) {
            $punto->update([
                'solicitud_estado' => null,
                'solicitud_fecha' => null,
                'solicitud_hora_desde' => null,
                'solicitud_hora_hasta' => null,
            ]);
        }

        // ✅ Permitir actualizar o crear solicitud del mismo recolector
        $punto->update([
            'recolector_id' => $recolector->id,
            'solicitud_estado' => 'pendiente',
            'solicitud_fecha' => $request->fecha,
            'solicitud_hora_desde' => $request->hora_desde,
            'solicitud_hora_hasta' => $request->hora_hasta,
        ]);

        return $this->respondOk('Solicitud enviada al usuario. Esperando confirmación.');
    }

    /**
     * ✅ Usuario acepta la solicitud (desde Usuario/Reciclajes/Index)
     */
    /**
     * ✅ Usuario acepta la solicitud (desde Usuario/MisReciclajes)
     */
    public function aceptarSolicitud(PuntoRecoleccion $punto)
    {
        // 🛑 Asegurar que haya una solicitud pendiente válida
        if ($punto->solicitud_estado !== 'pendiente' || !$punto->recolector_id) {
            return $this->respondError('No existe una solicitud pendiente para este punto.');
        }

        // 🟢 Actualizar el estado del punto
        $punto->update([
            'solicitud_estado' => 'aceptada',
            'estado'           => 'asignado',
            'aceptado_at'      => now(),
            'codigo'           => $punto->codigo ?: Str::upper(Str::random(8)),
        ]);

        // 🔁 Recargar el modelo con su relación actualizada (sin campo rating)
        $punto->refresh()->load('recolector:id,nombres,apellidos,puntaje');

        return response()->json([
            'ok'      => true,
            'message' => 'Solicitud aceptada correctamente.',
            'punto'   => $punto,
        ]);
    }

    /**
     * ❌ Usuario rechaza la solicitud
     */
    public function rechazarSolicitud(PuntoRecoleccion $punto)
    {
        // 🛑 Validar que esté pendiente
        if ($punto->solicitud_estado !== 'pendiente') {
            return $this->respondError('La solicitud ya fue respondida.');
        }

        // 🔴 Resetear los campos de asignación
        $punto->update([
            'solicitud_estado' => 'rechazada',
            'recolector_id'    => null,
        ]);

        $punto->refresh();

        return response()->json([
            'ok'      => true,
            'message' => 'Solicitud rechazada correctamente.',
            'punto'   => $punto,
        ]);
    }

    // ============================================================
    // 🔹 2️⃣ FLUJO NORMAL DE RECOLECCIÓN
    // ============================================================

    /**
     * 🚗 Marcar como “en camino”
     */
    public function enCamino(Request $request, PuntoRecoleccion $punto)
    {
        $this->autorizarRecolectorPropietario($punto);

        if (!in_array($punto->estado, ['asignado', 'en_camino'])) {
            return $this->respondError('No se puede marcar "en camino" desde este estado.');
        }

        $punto->update(['estado' => 'en_camino']);

        return $this->respondOk('Marcado como en camino.');
    }

    /**
     * 📦 Marcar como “recogido”
     */
    public function recogido(Request $request, PuntoRecoleccion $punto)
    {
        $this->autorizarRecolectorPropietario($punto);

        if (!in_array($punto->estado, ['asignado', 'en_camino'])) {
            return $this->respondError('No se puede marcar "recogido" desde este estado.');
        }

        $punto->update([
            'estado'      => 'recogido',
            'recogido_at' => now(),
        ]);

        return $this->respondOk('Material marcado como recogido.');
    }

    /**
     * 🏁 Completar recolección y asignar puntaje
     */
    public function completar(Request $request, PuntoRecoleccion $punto)
    {
        $this->autorizarRecolectorPropietario($punto);

        if (!in_array($punto->estado, ['recogido', 'en_camino'])) {
            return $this->respondError('Primero marcá el punto como recogido.');
        }

        DB::transaction(function () use ($punto) {
            $punto->update([
                'estado'        => 'completado',
                'completado_at' => now(),
            ]);

            // 🎯 Aumentar puntajes
            if ($punto->recolector) {
                $punto->recolector->increment('puntaje', 5);
            }
            if ($punto->usuario) {
                $punto->usuario->increment('puntaje', 2);
            }
        });

        // ⚡ Modal de calificación
        session()->flash('showRatingModal', true);

        return $this->respondOk('Recolección completada. ¡No olvides calificar!');
    }

    // ============================================================
    // 🔹 3️⃣ HELPERS INTERNOS
    // ============================================================

    /**
     * Autoriza solo al recolector propietario del punto
     */
    private function autorizarRecolectorPropietario(PuntoRecoleccion $punto): void
    {
        $recolector = auth()->user();
        abort_unless($punto->recolector_id === $recolector->id, 403, 'No tenés permiso para modificar este punto.');
    }

    /**
     * Respuesta estándar OK
     */
    private function respondOk(string $message)
    {
        return request()->expectsJson()
            ? response()->json(['ok' => true, 'message' => $message])
            : back()->with('success', $message);
    }

    /**
     * Respuesta estándar de error
     */
    private function respondError(string $message, int $status = 422)
    {
        return request()->expectsJson()
            ? response()->json(['ok' => false, 'message' => $message], $status)
            : back()->with('error', $message);
    }

    public function limpiarPendientes()
    {
        try {
            $recolector = auth()->user();

            if (!$recolector) {
                return response()->json([
                    'ok' => false,
                    'error' => 'No autenticado'
                ], 401);
            }

            // Solo limpiar solicitudes colgadas del recolector actual
            $limpiados = PuntoRecoleccion::where('recolector_id', $recolector->id)
                ->where(function ($q) {
                    $q->where('estado', 'pendiente')
                        ->where(function ($sub) {
                            $sub->where('solicitud_estado', 'rechazada')
                                ->orWhereNull('solicitud_estado')
                                ->orWhere('solicitud_estado', 'pendiente');
                        });
                })
                ->update([
                    'recolector_id' => null,
                    'solicitud_estado' => null,
                    'solicitud_fecha' => null,
                    'solicitud_hora_desde' => null,
                    'solicitud_hora_hasta' => null,
                ]);

            return response()->json([
                'ok' => true,
                'mensaje' => "🧹 Se limpiaron {$limpiados} puntos pendientes.",
            ]);
        } catch (\Throwable $e) {
            \Log::error("Error al limpiar pendientes: " . $e->getMessage());
            return response()->json([
                'ok' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
