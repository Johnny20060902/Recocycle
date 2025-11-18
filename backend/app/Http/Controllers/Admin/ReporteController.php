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
            // ✅ Mantiene compatibilidad con AppLayout (auth.user.role)
            'auth' => [
                'user' => $user,
            ],
        ]);
    }

    /**
     * 🧾 Generar PDF de Recolectores
     * Muestra el PDF en otra pestaña
     */
    public function recolectoresReporte()
    {
        $recolectores = Usuario::where('role', 'recolector')->get();

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

        // 🔹 Mostrar en pestaña nueva (sin romper flujo Inertia)
        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header(
                'Content-Disposition',
                'inline; filename="Reporte_Recolectores_' . now()->format('Ymd_His') . '.pdf"'
            );
    }

    /**
     * 💾 Descargar PDF de Recolectores
     */
    public function recolectoresDescargar()
    {
        $recolectores = Usuario::where('role', 'recolector')->get();

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

        // 🔹 Descargar directamente
        return response()->streamDownload(
            fn() => print($pdf->output()),
            'Reporte_Recolectores_' . now()->format('Ymd_His') . '.pdf'
        );
    }

    /**
     * 👥 Generar PDF de Usuarios
     * Muestra el PDF en otra pestaña (sin romper flujo)
     */
    public function usuariosReporte()
    {
        $usuarios = Usuario::where('role', 'usuario')->get();

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

        // 🔹 Mostrar directamente en navegador
        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header(
                'Content-Disposition',
                'inline; filename="Reporte_Usuarios_' . now()->format('Ymd_His') . '.pdf"'
            );
    }

    /**
     * 💾 Descargar PDF de Usuarios
     */
    public function usuariosDescargar()
    {
        $usuarios = Usuario::where('role', 'usuario')->get();

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

        // 🔹 Descargar archivo PDF
        return response()->streamDownload(
            fn() => print($pdf->output()),
            'Reporte_Usuarios_' . now()->format('Ymd_His') . '.pdf'
        );
    }
}
