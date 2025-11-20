<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\PuntoRecoleccion;
use App\Models\Categoria;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        // 🔹 Contadores por tipo de usuario
        $usuariosNormales = Usuario::where('role', 'usuario')->count();
        $recolectores = Usuario::where('role', 'recolector')->count();
        $administradores = Usuario::where('role', 'admin')->count();
        $totalUsuarios = Usuario::count();

        // ⚙️ Recolectores activos
        $recolectoresActivos = Usuario::where('role', 'recolector')
            ->where('estado', true)
            ->count();

        // 🔹 Recolecciones totales y pendientes
        $recoleccionesTotales = PuntoRecoleccion::where('estado', 'completado')->count();
        $reportesPendientes = PuntoRecoleccion::where('estado', 'pendiente')
            ->whereNull('recolector_id')
            ->count();

        // 🔹 Material reciclado total
        $materialReciclado = (float) PuntoRecoleccion::where('estado', 'completado')
            ->whereNotNull('peso')
            ->sum('peso');

        // 🔹 Top recolectores (ranking real)
        $topRecolectores = Usuario::where('role', 'recolector')
            ->select('id', 'nombres', 'apellidos', 'puntaje', 'rating_promedio')
            ->orderByDesc('puntaje')
            ->take(4)
            ->get()
            ->map(function ($r) {
                $r->recolecciones = PuntoRecoleccion::where('recolector_id', $r->id)
                    ->where('estado', 'completado')
                    ->count();
                return $r;
            });

        // 🔹 Distribución de materiales según categorías
        $categorias = Categoria::select('id', 'nombre')->get();
        $distribucion = $categorias->map(function ($cat) {
            $peso = PuntoRecoleccion::whereHas('reciclaje', function ($q) use ($cat) {
                $q->where('categoria_id', $cat->id);
            })
                ->where('estado', 'completado')
                ->sum('peso');
            return [
                'nombre' => $cat->nombre,
                'peso' => (float) $peso,
            ];
        });

        // Calcular porcentajes
        $totalPeso = max($distribucion->sum('peso'), 1);
        $distribucionGrafico = $distribucion->map(function ($d) use ($totalPeso) {
            return [
                'nombre' => $d['nombre'],
                'porcentaje' => round(($d['peso'] / $totalPeso) * 100, 1),
            ];
        });

// 🔹 Gráficos semanales (últimos 7 días)
$reciclajeSemanal = collect(range(0, 6))->map(function ($i) {
    $fecha = now()->subDays(6 - $i)->toDateString();

    $valor = PuntoRecoleccion::whereDate('created_at', $fecha)
        ->where('estado', 'completado')
        ->sum('peso');

    return (float) ($valor ?? 0);
});

$usuariosNuevos = collect(range(0, 6))->map(function ($i) {
    $fecha = now()->subDays(6 - $i)->toDateString();

    $valor = Usuario::whereDate('created_at', $fecha)->count();

    return (int) ($valor ?? 0);
});


        return Inertia::render('Admin/Dashboard', [
            'auth'                 => ['user' => auth()->user()],
            // 🧍 Totales de usuarios por rol
            'usuariosNormales'     => $usuariosNormales,
            'recolectores'         => $recolectores,
            'administradores'      => $administradores,
            'totalUsuarios'        => $totalUsuarios,

            // 🚛 Actividad y métricas
            'recolectoresActivos'  => $recolectoresActivos,
            'materialReciclado'    => round($materialReciclado, 2),
            'recoleccionesTotales' => $recoleccionesTotales,
            'reportesPendientes'   => $reportesPendientes,

            // 📈 Datos gráficos
            'reciclajeSemanal'     => $reciclajeSemanal,
            'usuariosNuevos'       => $usuariosNuevos,
            'topRecolectores'      => $topRecolectores,
            'distribucion'         => $distribucionGrafico,
        ]);
    }
}
