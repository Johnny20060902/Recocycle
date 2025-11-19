<?php

namespace App\Http\Controllers\Usuario;

use App\Http\Controllers\Controller;
use App\Models\Reciclaje;
use App\Models\Categoria;
use App\Models\PuntoRecoleccion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReciclajeController extends Controller
{
    /**
     * 🟢 Mostrar formulario de registro de reciclaje
     */
    public function create()
    {
        $categorias = Categoria::select('id', 'nombre')->get();

        return Inertia::render('Usuario/Reciclar', [
            'categorias' => $categorias,
            'auth'       => Auth::user(),
        ]);
    }

    /**
     * 💾 Guardar nuevo reciclaje y punto de recolección asociado
     */
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return back()->with('error', 'Debe iniciar sesión para registrar reciclaje.');
        }

        // 🔁 Decodificar JSON si llega como string
        if ($request->has('fechas') && is_string($request->fechas)) {
            $request->merge([
                'fechas' => json_decode($request->fechas, true)
            ]);
        }

        // ✅ Validación
        $validated = $request->validate([
            'categoria_id'        => 'required|exists:categorias,id',
            'descripcion'         => 'nullable|string|max:1000',
            'latitud'             => 'required|numeric',
            'longitud'            => 'required|numeric',
            'imagenes.*'          => 'nullable|image|max:5120',
            'fechas'              => 'required|array|min:1',
            'fechas.*.fecha'      => 'required|date',
            'fechas.*.hora_desde' => 'required|string',
            'fechas.*.hora_hasta' => 'required|string',
        ]);

        // 📸 Guardar imágenes
        $imagenes = [];
        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $imagen) {
                $path = $imagen->store('reciclajes', 'public');
                $imagenes[] = $path;
            }
        }

        // 💾 Crear reciclaje principal
        $reciclaje = Reciclaje::create([
            'usuario_id'   => Auth::id(),
            'categoria_id' => $validated['categoria_id'],
            'descripcion'  => $validated['descripcion'] ?? null,
            'registros'    => $validated['fechas'],
            'latitud'      => $validated['latitud'],
            'longitud'     => $validated['longitud'],
            'imagenes_url' => $imagenes,
            'estado'       => 'pendiente',
        ]);

        // 🕒 Primera fecha disponible
        $fechaSeleccionada = $validated['fechas'][0]['fecha'] ?? now()->toDateString();
        $horaDesde         = $validated['fechas'][0]['hora_desde'] ?? null;
        $horaHasta         = $validated['fechas'][0]['hora_hasta'] ?? null;

        // 📍 Crear punto de recolección asociado
        $punto = new PuntoRecoleccion([
            'usuario_id'        => Auth::id(),
            'reciclaje_id'      => $reciclaje->id,
            'latitud'           => $validated['latitud'],
            'longitud'          => $validated['longitud'],
            'material'          => $reciclaje->categoria->nombre ?? 'Sin categoría',
            'peso'              => 0,
            'fecha'             => now()->toDateString(),
            'fecha_disponible'  => $fechaSeleccionada,
            'hora_desde'        => $horaDesde,
            'hora_hasta'        => $horaHasta,
            'descripcion'       => $validated['descripcion'] ?? null,
            'estado'            => 'pendiente',
            'codigo'            => Str::upper(Str::random(8)),
        ]);

        $reciclaje->puntoRecoleccion()->save($punto);

        return response()->json([
            'ok'         => true,
            'msg'        => 'Reciclaje y punto de recolección registrados correctamente.',
            'reciclaje'  => $reciclaje,
            'punto'      => $punto,
        ]);
    }

    /**
     * 📋 Listado de reciclajes del usuario con puntos + calificación
     */
    public function index()
    {
        if (!Auth::check()) {
            return redirect()->route('usuario.login')
                ->with('error', 'Debe iniciar sesión para ver sus reciclajes.');
        }

        $userId = Auth::id();

        // 📦 Cargar todos los puntos con relaciones necesarias
        $puntos = PuntoRecoleccion::with([
            'recolector:id,nombres,apellidos,rating_promedio',
            'usuario:id,nombres,apellidos',
            'reciclaje:id,imagenes_url' // 👈 necesario para mostrar imágenes
        ])
            ->where('usuario_id', $userId)
            ->latest()
            ->get()
            ->map(function ($punto) use ($userId) {
                $yaCalifique = $punto->calificaciones()
                    ->where('evaluador_id', $userId)
                    ->exists();

                return [
                    'id'               => $punto->id,
                    'material'         => $punto->material,
                    'descripcion'      => $punto->descripcion,
                    'estado'           => $punto->estado,
                    'fecha_disponible' => $punto->fecha_disponible,
                    'hora_desde'       => $punto->hora_desde,
                    'hora_hasta'       => $punto->hora_hasta,
                    'solicitud_estado' => $punto->solicitud_estado,
                    'imagenes_url'     => $punto->reciclaje?->imagenes_url ?? [],
                    'recolector'       => $punto->recolector ? [
                        'nombres'   => $punto->recolector->nombres,
                        'apellidos' => $punto->recolector->apellidos,
                        'rating'    => $punto->recolector->rating_promedio,
                    ] : null,
                    'ya_califique'     => $yaCalifique,
                ];
            });

        return Inertia::render('Usuario/Reciclajes/Index', [
            'puntos' => $puntos,
            'auth'   => Auth::user(),
        ]);
    }

    // ============================================================
    // 🔹 Responder solicitudes de recolectores
    // ============================================================

    /**
     * ✅ Usuario acepta la solicitud del recolector
     */
    public function aceptarSolicitud($id)
    {
        $punto = PuntoRecoleccion::findOrFail($id);

        if ($punto->solicitud_estado !== 'pendiente') {
            return response()->json(['ok' => false, 'msg' => 'La solicitud ya fue procesada.']);
        }

        $punto->update([
            'solicitud_estado' => 'aceptada',
            'estado'           => 'asignado',
            'aceptado_at'      => now(),
        ]);

        return response()->json([
            'ok'  => true,
            'msg' => 'Solicitud aceptada correctamente.',
        ]);
    }

    /**
     * ❌ Usuario rechaza la solicitud del recolector
     */
    public function rechazarSolicitud($id)
    {
        $punto = PuntoRecoleccion::findOrFail($id);

        if ($punto->solicitud_estado !== 'pendiente') {
            return response()->json(['ok' => false, 'msg' => 'La solicitud ya fue procesada.']);
        }

        $punto->update([
            'solicitud_estado' => 'rechazada',
            'recolector_id'    => null,
        ]);

        return response()->json([
            'ok'  => true,
            'msg' => 'Solicitud rechazada correctamente.',
        ]);
    }

    public function destroy($id)
{
    $punto = PuntoRecoleccion::with('reciclaje')
        ->where('usuario_id', Auth::id())
        ->findOrFail($id);

    // borrar imágenes físicas
    if ($punto->reciclaje && is_array($punto->reciclaje->imagenes_url)) {
        foreach ($punto->reciclaje->imagenes_url as $img) {
            \Storage::disk('public')->delete($img);
        }
    }

    if ($punto->reciclaje) {
        $punto->reciclaje->delete();
    }

    $punto->delete();

    return response()->json(['ok' => true, 'msg' => 'Reciclaje eliminado correctamente.']);
}

public function list()
{
    $user = auth()->user();

    $puntos = \App\Models\PuntoRecoleccion::with(['recolector'])
        ->where('usuario_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json([
        'success' => true,
        'puntos'  => $puntos,
    ]);
}


}
