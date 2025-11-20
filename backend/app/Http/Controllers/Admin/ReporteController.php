<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class ReporteController extends Controller
{
    /**
     * 📊 Vista principal con botones de reportes
     */
    public function index()
    {
        $user = auth()->user();

        return Inertia::render('Admin/Reportes/Index', [
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * 🧾 Mostrar PDF de recolectores
     */
    public function recolectoresReporte()
    {
        $recolectores = Usuario::where('role', 'recolector')
            ->select(
                'id',
                'nombres',
                'apellidos',
                'email',
                'contacto',
                'puntaje',
                'rating_promedio',
                'estado',
                'created_at'
            )
            ->withCount('reciclajes as total_reciclajes')
            ->orderBy('id', 'desc')
            ->get();

        $activos = $recolectores->where('estado', 'activo')->count();
        $inactivos = $recolectores->where('estado', 'inactivo')->count();
        $pendientes = $recolectores->where('estado', 'pendiente')->count();

        $fecha = now()->format('d/m/Y H:i');

        $pdf = Pdf::loadView('pdfs.report_recolectores', [
            'recolectores' => $recolectores,
            'activos' => $activos,
            'inactivos' => $inactivos,
            'pendientes' => $pendientes,
            'fecha' => $fecha,
        ])->setPaper('a4', 'portrait');

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="Reporte_Recolectores_' . now()->format('Ymd_His') . '.pdf"');
    }

    /**
     * 💾 Descargar PDF de Recolectores
     */
    public function recolectoresDescargar()
    {
        $recolectores = Usuario::where('role', 'recolector')
            ->select(
                'id',
                'nombres',
                'apellidos',
                'email',
                'contacto',
                'puntaje',
                'rating_promedio',
                'estado',
                'created_at'
            )
            ->withCount('reciclajes as total_reciclajes')
            ->orderBy('id', 'desc')
            ->get();

        $activos = $recolectores->where('estado', 'activo')->count();
        $inactivos = $recolectores->where('estado', 'inactivo')->count();
        $pendientes = $recolectores->where('estado', 'pendiente')->count();

        $fecha = now()->format('d/m/Y H:i');

        $pdf = Pdf::loadView('pdfs.report_recolectores', [
            'recolectores' => $recolectores,
            'activos' => $activos,
            'inactivos' => $inactivos,
            'pendientes' => $pendientes,
            'fecha' => $fecha,
        ])->setPaper('a4', 'portrait');

        return response()->streamDownload(
            fn() => print($pdf->output()),
            'Reporte_Recolectores_' . now()->format('Ymd_His') . '.pdf'
        );
    }

    /**
     * 👥 Mostrar PDF de Usuarios
     */
    public function usuariosReporte()
    {
        $usuarios = Usuario::where('role', 'usuario')
            ->select(
                'id',
                'nombres',
                'apellidos',
                'email',
                'contacto',
                'puntaje',
                'rating_promedio',
                'estado',
                'created_at'
            )
            ->withCount('reciclajes as total_reciclajes')
            ->orderBy('id', 'desc')
            ->get();

        $activos = $usuarios->where('estado', 'activo')->count();
        $inactivos = $usuarios->where('estado', 'inactivo')->count();
        $pendientes = $usuarios->where('estado', 'pendiente')->count();

        $fecha = now()->format('d/m/Y H:i');

        $pdf = Pdf::loadView('pdfs.report_usuarios', [
            'usuarios' => $usuarios,
            'activos' => $activos,
            'inactivos' => $inactivos,
            'pendientes' => $pendientes,
            'fecha' => $fecha,
        ])->setPaper('a4', 'portrait');

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="Reporte_Usuarios_' . now()->format('Ymd_His') . '.pdf"');
    }

    /**
     * 💾 Descargar PDF de Usuarios
     */
    public function usuariosDescargar()
    {
        $usuarios = Usuario::where('role', 'usuario')
            ->select(
                'id',
                'nombres',
                'apellidos',
                'email',
                'contacto',
                'puntaje',
                'rating_promedio',
                'estado',
                'created_at'
            )
            ->withCount('reciclajes as total_reciclajes')
            ->orderBy('id', 'desc')
            ->get();

        $activos = $usuarios->where('estado', 'activo')->count();
        $inactivos = $usuarios->where('estado', 'inactivo')->count();
        $pendientes = $usuarios->where('estado', 'pendiente')->count();

        $fecha = now()->format('d/m/Y H:i');

        $pdf = Pdf::loadView('pdfs.report_usuarios', [
            'usuarios' => $usuarios,
            'activos' => $activos,
            'inactivos' => $inactivos,
            'pendientes' => $pendientes,
            'fecha' => $fecha,
        ])->setPaper('a4', 'portrait');

        return response()->streamDownload(
            fn() => print($pdf->output()),
            'Reporte_Usuarios_' . now()->format('Ymd_His') . '.pdf'
        );
    }
}
