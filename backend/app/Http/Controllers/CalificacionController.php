<?php

namespace App\Http\Controllers;

use App\Models\Calificacion;
use App\Models\PuntoRecoleccion;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CalificacionController extends Controller
{
    /**
     * 💬 Guardar una calificación (usuario ↔ recolector)
     */
public function store(Request $request)
{
    $data = $request->validate([
        'punto_recoleccion_id' => ['required', 'exists:punto_recoleccions,id'],
        'puntaje'              => ['required', 'integer', 'min:1', 'max:5'],
        'comentario'           => ['nullable', 'string', 'max:400'],
    ]);

    /** @var Usuario $actor */
    $actor = auth()->user();
    $punto = PuntoRecoleccion::with(['usuario', 'recolector'])->findOrFail($data['punto_recoleccion_id']);

    // 🔐 Validación de permisos
    abort_unless(in_array($actor->id, [$punto->usuario_id, $punto->recolector_id]), 403);

    // ⛔ Solo cuando la recolección esté completada
    if ($punto->estado !== 'completado') {
        return $this->respondError('Solo podés calificar cuando la recolección esté completada.');
    }

    // 👥 Identificar roles
    $rolEvaluador = $actor->id === $punto->recolector_id ? 'recolector' : 'usuario';
    $evaluadoId   = $rolEvaluador === 'recolector' ? $punto->usuario_id : $punto->recolector_id;

    // 🚫 Evitar duplicados
    $yaExiste = Calificacion::where('punto_recoleccion_id', $punto->id)
        ->where('evaluador_id', $actor->id)
        ->where('rol_evaluador', $rolEvaluador)
        ->exists();

    if ($yaExiste) {
        return $this->respondError('Ya enviaste tu calificación para este punto.');
    }

    DB::transaction(function () use ($data, $punto, $actor, $rolEvaluador, $evaluadoId) {

        // 🌟 Escala InDrive
        $puntajeConvertido = (int)$data['puntaje'] * 2;

        Calificacion::create([
            'punto_recoleccion_id' => $punto->id,
            'evaluador_id'         => $actor->id,
            'evaluado_id'          => $evaluadoId,
            'rol_evaluador'        => $rolEvaluador,
            'puntaje'              => $puntajeConvertido,
            'comentario'           => $data['comentario'] ?? null,
        ]);

        // ⭐⭐⭐ AQUI EL FIX IMPORTANTE ⭐⭐⭐
        $punto->ya_califique = true;
        $punto->save();

        // 🔄 Recalcular rating del evaluado
        $evaluado = Usuario::find($evaluadoId);
        if ($evaluado) {
            $promedioPuntos = Calificacion::where('evaluado_id', $evaluado->id)->avg('puntaje');
            $promedioReal   = $promedioPuntos / 2;

            $evaluado->update([
                'rating_promedio' => round($promedioReal, 2),
            ]);

            $evaluado->increment('puntaje', $puntajeConvertido);
        }
    });

    // 📤 Devolver punto actualizado para auto-refresh
    return response()->json([
        'ok'     => true,
        'message'=> '¡Gracias por tu calificación! 💚',
        'punto'  => $punto->fresh()->load(['recolector', 'reciclaje']),
    ]);
}

    // ============================================================
    // 📋 Listado de calificaciones (solo admin)
    // ============================================================
    public function index(Request $request)
    {
        $role = $request->query('role');

        $query = Calificacion::with(['punto', 'evaluador', 'evaluado'])
            ->latest();

        if (in_array($role, ['usuario', 'recolector'])) {
            $query->where('rol_evaluador', $role);
        }

        $calificaciones = $query->paginate(20)->withQueryString();

        if ($request->expectsJson()) {
            return response()->json($calificaciones);
        }

        return Inertia::render('Admin/Calificaciones/Index', [
            'items'   => $calificaciones,
            'filters' => ['role' => $role],
        ]);
    }

    // ============================================================
    // 🏆 Ranking: top usuarios o recolectores
    // ============================================================
    public function ranking(Request $request)
    {
        $tipo = $request->query('tipo', 'recolectores');
        $roleFiltro = $tipo === 'usuarios' ? 'usuario' : 'recolector';

        $items = Usuario::query()
            ->where('role', $roleFiltro)
            ->select(['id', 'nombres', 'apellidos', 'role', 'puntaje', 'rating_promedio'])
            ->orderByDesc('rating_promedio')
            ->orderByDesc('puntaje')
            ->paginate(20)
            ->withQueryString();

        if ($request->expectsJson()) {
            return response()->json($items);
        }

        return Inertia::render('Admin/Calificaciones/Ranking', [
            'items' => $items,
            'tipo'  => $tipo,
        ]);
    }

    // ============================================================
    // 🧩 Helpers de respuesta
    // ============================================================
    private function respondOk(string $message)
    {
        return request()->expectsJson()
            ? response()->json(['ok' => true, 'message' => $message])
            : back()->with('success', $message);
    }

    private function respondError(string $message, int $status = 422)
    {
        return request()->expectsJson()
            ? response()->json(['ok' => false, 'message' => $message], $status)
            : back()->with('error', $message);
    }
}
