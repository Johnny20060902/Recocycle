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
    /** 📊 Panel del recolector */
    public function index()
    {
        return Inertia::render('Recolector/Dashboard', [
            'title' => 'Panel del Recolector',
        ]);
    }

    /** 🗺️ Mapa de recolección */
    public function mapa()
    {
        $hoy = now()->toDateString();

        $puntos = PuntoRecoleccion::with([
                'usuario:id,nombres,apellidos,role,email',
                'reciclaje',
                'reciclaje.categoria',  // 🔥 Necesario para filtro
            ])
            ->whereHas('usuario', fn($q) => $q->where('role', 'usuario'))
            ->whereNotNull('fecha_disponible')
            ->whereDate('fecha_disponible', '>=', $hoy)
            ->orderBy('fecha_disponible', 'asc')
            ->select(
                'id', 'usuario_id', 'reciclaje_id', 'recolector_id',
                'latitud', 'longitud', 'material', 'peso', 'descripcion',
                'fecha', 'fecha_disponible', 'hora_desde', 'hora_hasta',
                'estado', 'solicitud_estado', 'foto_final'
            )
            ->get();

        $puntos = $this->prepararPuntosParaFront($puntos);

        $categorias = Categoria::select('id', 'nombre', 'descripcion')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Recolector/MapaRecolector', [
            'title'      => 'Mapa de Recolección',
            'puntos'     => $puntos,
            'categorias' => $categorias,
            'auth'       => auth()->user(),
        ]);
    }

    /** ♻️ Puntos disponibles (Axios: route('recolector.puntos')) */
    public function puntos()
    {
        $hoy = now()->toDateString();

        $puntos = PuntoRecoleccion::with([
                'usuario:id,nombres,apellidos,role,email',
                'reciclaje',
                'reciclaje.categoria',  // 🔥 Necesario para que el filtro siga funcionando
            ])
            ->whereHas('usuario', fn($q) => $q->where('role', 'usuario'))
            ->whereIn('estado', ['pendiente', 'asignado', 'en_camino'])
            ->whereDate('fecha_disponible', '>=', $hoy)
            ->orderBy('fecha_disponible', 'asc')
            ->select(
                'id', 'usuario_id', 'reciclaje_id', 'recolector_id',
                'latitud', 'longitud', 'material', 'peso', 'descripcion',
                'fecha', 'fecha_disponible', 'hora_desde', 'hora_hasta',
                'estado', 'solicitud_estado', 'foto_final'
            )
            ->get();

        return response()->json($this->prepararPuntosParaFront($puntos));
    }

    /** 📍 Puntos cercanos (geolocalización) */
    public function puntosCercanos(Request $request)
    {
        $lat = $request->lat;
        $lng = $request->lng;
        $radio = $request->radio ?? 5;

        if (!$lat || !$lng) {
            return response()->json(['error' => 'Coordenadas no enviadas'], 400);
        }

        $puntos = PuntoRecoleccion::with([
                'usuario:id,nombres,apellidos,role,email',
                'reciclaje',
                'reciclaje.categoria', // 🔥 Necesario para filtro en cercanos
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

        return response()->json($this->prepararPuntosParaFront($puntos));
    }

    /** ☑️ Tomar un punto */
    public function tomar(Request $request, $puntoId)
    {
        $punto = PuntoRecoleccion::with('reciclaje')->findOrFail($puntoId);

        if (!$punto->reciclaje_id) {
            $ultimo = Reciclaje::where('usuario_id', $punto->usuario_id)->latest()->first();
            if ($ultimo) {
                $punto->update(['reciclaje_id' => $ultimo->id]);
            }
        }

        if (!$punto->reciclaje) {
            return response()->json(['ok' => false, 'msg' => 'No se encontró reciclaje asociado.'], 422);
        }

        DB::transaction(function () use ($punto) {
            $punto->reciclaje->update(['estado' => 'aceptado']);
        });

        return response()->json(['ok' => true, 'msg' => 'Solicitud aceptada.']);
    }

    /** 🏆 Ranking de recolectores */
    public function ranking()
    {
        $recolectores = \App\Models\Usuario::where('role', 'recolector')
            ->select('id', 'nombres', 'apellidos', 'email', 'puntaje')
            ->withCount(['puntoRecoleccion as recolecciones'])
            ->orderByDesc('puntaje')
            ->get();

        return response()->json(['recolectores' => $recolectores]);
    }

    /** 🟢 Completar recolección */
    public function completar(Request $request, $puntoId)
    {
        $punto = PuntoRecoleccion::with('reciclaje')->findOrFail($puntoId);

        if (!$punto->reciclaje) {
            return response()->json(['ok' => false, 'msg' => 'No se encontró reciclaje asociado.'], 422);
        }

        $punto->reciclaje->update(['estado' => 'completado']);

        return response()->json(['ok' => true, 'msg' => 'Recolección completada.']);
    }

    /** 📜 Historial del recolector */
    public function historial()
    {
        $userId = Auth::id();

        $puntos = PuntoRecoleccion::with([
                'usuario:id,nombres,apellidos,rating_promedio',
                'reciclaje',
            ])
            ->where('recolector_id', $userId)
            ->latest()
            ->get();

        $puntos = $this->prepararPuntosParaFront($puntos);

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

    /** 📬 Enviar solicitud */
    public function solicitar(Request $request, $puntoId)
    {
        $request->validate([
            'fecha'       => 'required|date',
            'hora_desde'  => 'required',
            'hora_hasta'  => 'required',
        ]);

        $punto = PuntoRecoleccion::findOrFail($puntoId);

        if ($punto->solicitud_estado === 'pendiente') {
            return response()->json(['ok' => false, 'msg' => 'Ya existe una solicitud pendiente.'], 422);
        }

        $punto->update([
            'recolector_id'        => auth()->id(),
            'solicitud_estado'     => 'pendiente',
            'solicitud_fecha'      => $request->fecha,
            'solicitud_hora_desde' => $request->hora_desde,
            'solicitud_hora_hasta' => $request->hora_hasta,
        ]);

        return response()->json(['ok' => true, 'msg' => 'Solicitud enviada.']);
    }

    /** 🚗 Marcar en camino */
    public function enCamino($id)
    {
        $punto = PuntoRecoleccion::findOrFail($id);

        if ($punto->recolector_id !== auth()->id()) {
            return response()->json(['ok' => false, 'msg' => 'No estás asignado.'], 403);
        }

        $punto->update(['estado' => 'en_camino']);

        return response()->json(['ok' => true, 'msg' => 'Marcado en camino']);
    }

    /** 📸 Finalizar recolección */
    public function finalizarRecoleccion(Request $request, $id)
    {
        $request->validate([
            'foto_final' => 'required|image|max:5120',
        ]);

        $punto = PuntoRecoleccion::findOrFail($id);

        if ($punto->recolector_id !== auth()->id()) {
            return response()->json(['ok' => false, 'msg' => 'No estás asignado.'], 403);
        }

        $path = $request->file('foto_final')->store('recolecciones_finales', 'public');

        $punto->update([
            'foto_final'    => $path,
            'estado'        => 'completado',
            'completado_at' => now(),
        ]);

        if ($punto->reciclaje) {
            $punto->reciclaje->update(['estado' => 'completado']);
        }

        return response()->json([
            'ok'   => true,
            'msg'  => 'Recolección finalizada.',
            'foto' => asset('storage/' . $path),
        ]);
    }

    /** 🔧 Normalizar datos para React */
    private function prepararPuntosParaFront($puntos)
    {
        $puntos->each(function ($p) {
            $fotosUsuario = [];

            if ($p->reciclaje) {

                // registros → array limpio
                if (is_string($p->reciclaje->registros)) {
                    $decoded = json_decode($p->reciclaje->registros, true);
                    $p->reciclaje->registros = is_array($decoded) ? $decoded : [];
                } elseif (!is_array($p->reciclaje->registros)) {
                    $p->reciclaje->registros = [];
                }

                // imágenes del usuario
                $imgs = $p->reciclaje->imagenes_url ?? [];

                if (is_string($imgs)) {
                    $decodedImgs = json_decode($imgs, true);
                    $imgs = is_array($decodedImgs) ? $decodedImgs : [$imgs];
                }

                $fotosUsuario = collect($imgs)
                    ->filter(fn($v) => is_string($v) && trim($v) !== '')
                    ->values()
                    ->toArray();
            }

            // foto final del recolector
            $fotos = $fotosUsuario;
            if (!empty($p->foto_final)) {
                $fotos[] = $p->foto_final;
            }

            $p->fotos = $fotos;
        });

        return $puntos;
    }
}
