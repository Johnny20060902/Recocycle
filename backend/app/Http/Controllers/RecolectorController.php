<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\PuntoRecoleccion;
use App\Models\Reciclaje;
use App\Models\Categoria;
use Inertia\Inertia;

class RecolectorController extends Controller
{
    /** 📊 Panel principal del recolector */
    public function index()
    {
        return Inertia::render('Recolector/Dashboard', [
            'title' => 'Panel del Recolector',
        ]);
    }

    /** 🗺️ Vista del mapa de recolección */
    public function mapa()
    {
    $hoy = now()->toDateString();

    // 🔹 Cargar puntos con relaciones necesarias
    $puntos = PuntoRecoleccion::with([
            'usuario:id,nombres,apellidos,role,email',
            'reciclaje'
        ])
        ->whereHas('usuario', fn($q) => $q->where('role', 'usuario'))
        ->whereNotNull('fecha_disponible')
        ->whereDate('fecha_disponible', '>=', $hoy)
        ->orderBy('fecha_disponible', 'asc')
        ->select(
            'id',
            'usuario_id',
            'reciclaje_id',
            'recolector_id',
            'latitud',
            'longitud',
            'material',
            'peso',
            'fecha',
            'descripcion',
            'fecha_disponible',
            'hora_desde',
            'hora_hasta',
            'estado',
            'solicitud_estado',
            'foto_final'
        )
        ->get();

    // 🔧 Normalizar fotos y registros
    $puntos = $this->prepararPuntosParaFront($puntos);

    // 🔥 NUEVO: obtener categorías REALES desde las empresas
    // Empresas -> categorias (json) -> aplanar -> únicas
    $categorias = \App\Models\Empresa::whereNotNull('categorias')
        ->pluck('categorias')     // colección de arrays
        ->flatten()               // une todos en uno solo
        ->unique()                // sin duplicados
        ->values();               // indices limpios

    return Inertia::render('Recolector/MapaRecolector', [
        'title'      => 'Mapa de Recolección',
        'puntos'     => $puntos,
        'categorias' => $categorias,
        'auth'       => auth()->user(),
    ]);
}

    /**
     * ♻️ Obtener puntos disponibles para los recolectores (para axios route('recolector.puntos'))
     */
    public function puntos()
    {
        $hoy = now()->toDateString();

        $puntos = PuntoRecoleccion::with([
                'usuario:id,nombres,apellidos,role,email',
                'reciclaje', // 👈 traemos todo, incluyendo fotos
            ])
            // 🔍 Puntos creados por usuarios finales
            ->whereHas('usuario', fn($q) => $q->where('role', 'usuario'))
            // ♻️ Mostrar puntos activos o pendientes
            ->whereIn('estado', ['pendiente', 'asignado', 'en_camino'])
            // 📅 Mostrar puntos desde hoy en adelante
            ->whereDate('fecha_disponible', '>=', $hoy)
            // 🕓 Ordenar por fecha próxima
            ->orderBy('fecha_disponible', 'asc')
            // ✨ Campos relevantes del punto (incluimos foto_final)
            ->select(
                'id',
                'usuario_id',
                'reciclaje_id',
                'recolector_id',
                'latitud',
                'longitud',
                'material',
                'peso',
                'descripcion',
                'fecha',
                'fecha_disponible',
                'hora_desde',
                'hora_hasta',
                'estado',
                'solicitud_estado',
                'foto_final'
            )
            ->get();

        // 🔧 Normalizamos registros y fotos para el front (mismo formato que en mapa())
        $puntos = $this->prepararPuntosParaFront($puntos);

        return response()->json($puntos);
    }

    /**
     * 📍 Obtener puntos cercanos al recolector (radio en km)
     */
    public function puntosCercanos(Request $request)
    {
        $lat = $request->input('lat');
        $lng = $request->input('lng');
        $radio = $request->input('radio', 5); // Por defecto 5 km

        if (!$lat || !$lng) {
            return response()->json(['error' => 'Coordenadas no enviadas'], 400);
        }

        $puntos = PuntoRecoleccion::with([
                'usuario:id,nombres,apellidos,role,email',
                'reciclaje', // 👈 también aquí, por si usás este endpoint
            ])
            ->selectRaw("
                id, usuario_id, reciclaje_id, recolector_id,
                latitud, longitud, material, peso, fecha, descripcion,
                fecha_disponible, hora_desde, hora_hasta, estado, solicitud_estado, foto_final,
                (6371 * acos(
                    cos(radians(?)) * cos(radians(latitud)) *
                    cos(radians(longitud) - radians(?)) +
                    sin(radians(?)) * sin(radians(latitud))
                )) AS distancia
            ", [$lat, $lng, $lat])
            ->having('distancia', '<=', $radio)
            ->orderBy('distancia', 'asc')
            ->get();

        $puntos = $this->prepararPuntosParaFront($puntos);

        return response()->json($puntos);
    }

    /**
     * ✅ El recolector toma un punto (acepta solicitud)
     * y cambia el estado del reciclaje a 'aceptado'
     */
    public function tomar(Request $request, $puntoId)
    {
        $punto = PuntoRecoleccion::with('reciclaje')->findOrFail($puntoId);

        // 🔍 Vincular reciclaje automáticamente si no tiene relación
        if (!$punto->reciclaje_id) {
            $reciclajeRelacionado = Reciclaje::where('usuario_id', $punto->usuario_id)
                ->latest()
                ->first();

            if ($reciclajeRelacionado) {
                $punto->reciclaje_id = $reciclajeRelacionado->id;
                $punto->save();
            }
        }

        // Si aún no se encuentra un reciclaje, devolvemos error controlado
        if (!$punto->reciclaje && !$punto->reciclaje_id) {
            return response()->json([
                'ok' => false,
                'msg' => 'No se encontró reciclaje asociado al punto.'
            ], 422);
        }

        DB::transaction(function () use ($punto) {
            $reciclaje = $punto->reciclaje ?? Reciclaje::find($punto->reciclaje_id);

            if ($reciclaje) {
                $reciclaje->estado = 'aceptado';
                $reciclaje->save();
            }
        });

        return response()->json([
            'ok' => true,
            'msg' => 'Solicitud aceptada. Estado actualizado a "aceptado".'
        ]);
    }

    public function ranking()
    {
        $recolectores = \App\Models\Usuario::where('role', 'recolector')
            ->select('id', 'nombres', 'apellidos', 'email', 'puntaje')
            ->withCount(['puntoRecoleccion as recolecciones'])
            ->orderByDesc('puntaje')
            ->get();

        return response()->json(['recolectores' => $recolectores]);
    }

    /**
     * 🟩 Marcar recolección como completada (estado 'completado')
     */
    public function completar(Request $request, $puntoId)
    {
        $punto = PuntoRecoleccion::with('reciclaje')->findOrFail($puntoId);

        if (!$punto->reciclaje) {
            return response()->json([
                'ok' => false,
                'msg' => 'No se encontró reciclaje asociado al punto.'
            ], 422);
        }

        $punto->reciclaje->estado = 'completado';
        $punto->reciclaje->save();

        return response()->json([
            'ok' => true,
            'msg' => 'Recolección completada. Estado actualizado a "completado".'
        ]);
    }

public function historial()
{
    $userId = Auth::id();

    $puntos = PuntoRecoleccion::with([
            'usuario:id,nombres,apellidos,rating_promedio',
            'reciclaje' // 👈 NECESARIO para traer fotos
        ])
        ->where('recolector_id', $userId)
        ->latest()
        ->get();

    // 🔥 Normalizamos fotos e imágenes para el carrusel
    $puntos = $this->prepararPuntosParaFront($puntos);

    // 🔥 Agregamos flag ya_califique por cada punto
    $puntos = $puntos->map(function ($p) use ($userId) {
        $p->ya_califique = $p->calificaciones()
            ->where('evaluador_id', $userId)
            ->exists();

        return $p;
    });

    return Inertia::render('Recolector/Historial', [
        'puntos' => $puntos,
        'auth'   => Auth::user(),
    ]);
}

    /**
     * 📅 El recolector selecciona una fecha/hora y envía solicitud al usuario
     */
    public function solicitar(Request $request, $puntoId)
    {
        $request->validate([
            'fecha'       => 'required|date',
            'hora_desde'  => 'required',
            'hora_hasta'  => 'required',
        ]);

        $recolector = auth()->user();
        $punto = PuntoRecoleccion::findOrFail($puntoId);

        // 🔍 Evitar duplicar solicitudes
        if ($punto->solicitud_estado === 'pendiente') {
            return response()->json([
                'ok' => false,
                'msg' => 'Ya existe una solicitud pendiente para este punto.'
            ], 422);
        }

        // 📝 Actualizar punto con la solicitud del recolector
        $punto->update([
            'recolector_id'        => $recolector->id,
            'solicitud_estado'     => 'pendiente',
            'solicitud_fecha'      => $request->fecha,
            'solicitud_hora_desde' => $request->hora_desde,
            'solicitud_hora_hasta' => $request->hora_hasta,
        ]);

        return response()->json([
            'ok'  => true,
            'msg' => 'Solicitud enviada correctamente al usuario.'
        ]);
    }

    public function enCamino($id)
    {
        $punto = PuntoRecoleccion::findOrFail($id);

        // Validar que el recolector actual sea el asignado
        if ($punto->recolector_id !== auth()->id()) {
            return response()->json(['ok' => false, 'msg' => 'No estás asignado a este punto.'], 403);
        }

        $punto->update(['estado' => 'en_camino']);

        return response()->json([
            'ok' => true,
            'msg' => 'Punto marcado como "en camino"',
        ]);
    }

    /**
     * 📸 Finalizar recolección, subir foto y cerrar flujo
     */
    public function finalizarRecoleccion(Request $request, $id)
    {
        $request->validate([
            'foto_final' => 'required|image|max:5120', // 5 MB
        ]);

        $punto = PuntoRecoleccion::findOrFail($id);

        if ($punto->recolector_id !== auth()->id()) {
            return response()->json(['ok' => false, 'msg' => 'No estás asignado a este punto.'], 403);
        }

        // Guardar la foto
        $path = $request->file('foto_final')->store('recolecciones_finales', 'public');

        $punto->update([
            'foto_final'    => $path,
            'estado'        => 'completado',
            'completado_at' => now(),
        ]);

        // Actualizar reciclaje si existe
        if ($punto->reciclaje) {
            $punto->reciclaje->update(['estado' => 'completado']);
        }

        return response()->json([
            'ok'   => true,
            'msg'  => 'Recolección finalizada correctamente.',
            'foto' => asset('storage/' . $path),
        ]);
    }

/**
 * 🔧 Normaliza registros y fotos para el frontend (p.fotos)
 */
private function prepararPuntosParaFront($puntos)
{
    $puntos->each(function ($p) {
        $fotosUsuario = [];

        if ($p->reciclaje) {
            // -----------------------------
            // 1) registros como array
            // -----------------------------
            if (isset($p->reciclaje->registros) && is_string($p->reciclaje->registros)) {
                $decoded = json_decode($p->reciclaje->registros, true);
                $p->reciclaje->registros = is_array($decoded) ? $decoded : [];
            } elseif (!isset($p->reciclaje->registros) || !is_array($p->reciclaje->registros)) {
                $p->reciclaje->registros = $p->reciclaje->registros ?? [];
            }

            // -----------------------------
            // 2) IMÁGENES DEL USUARIO
            //    columna: reciclajes.imagenes_url
            // -----------------------------
            $imgs = $p->reciclaje->imagenes_url ?? [];

            if (is_string($imgs)) {
                // viene como JSON string
                $decodedImgs = json_decode($imgs, true);
                if (is_array($decodedImgs)) {
                    $fotosUsuario = $decodedImgs;
                } elseif (!empty($imgs)) {
                    $fotosUsuario = [$imgs];
                }
            } elseif (is_array($imgs)) {
                $fotosUsuario = $imgs;
            } elseif ($imgs) {
                // por si viene como un solo string raro
                $fotosUsuario = [$imgs];
            }

            // limpiar: solo strings no vacíos
            $fotosUsuario = array_values(
                array_filter($fotosUsuario, fn ($v) => is_string($v) && trim($v) !== '')
            );

            // lo dejamos también en el reciclaje por si el front lo usa directo
            $p->reciclaje->imagenes_url = $fotosUsuario;
        }

        // -----------------------------
        // 3) Foto final del recolector
        // -----------------------------
        $fotos = $fotosUsuario;

        if (!empty($p->foto_final)) {
            $fotos[] = $p->foto_final;
        }

        // 👈 ESTE campo es el que usa el carrusel en React
        $p->fotos = $fotos;
    });

    return $puntos;
}

}
