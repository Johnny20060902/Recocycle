<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Barryvdh\DomPDF\Facade\Pdf;

class RecolectorController extends Controller
{
    /**
     * 📋 Listado de todos los recolectores del sistema
     */
    public function index()
    {
        $recolectores = Usuario::select(
            'id',
            'nombres',
            'apellidos',
            'email',
            'estado',
            'puntaje',
            'rating_promedio'
        )
            ->where('role', 'recolector')
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Admin/Recolectores/Index', [
            'auth' => [
                'user' => auth()->user(), // ✅ estructura correcta
            ],
            'recolectores' => $recolectores,
        ]);
    }

    /**
     * 🆕 Formulario para crear un nuevo recolector
     */
    public function create()
    {
        return Inertia::render('Admin/Recolectores/Create', [
            'auth' => [
                'user' => auth()->user(), // ✅ se mantiene el rol admin
            ],
        ]);
    }

    /**
     * 💾 Guardar un nuevo recolector
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombres'   => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email'     => 'required|email|unique:usuarios,email',
            'password'  => 'required|string|min:6',
            'estado'    => 'required|string|in:activo,inactivo,pendiente',
        ]);

        $data['role'] = 'recolector';
        $data['password'] = Hash::make($data['password']);

        Usuario::create($data);

        return redirect()
            ->route('admin.recolectores.index')
            ->with('success', '✅ Recolector registrado correctamente.');
    }

    /**
     * ✏️ Formulario de edición de recolector
     */
    public function edit(Usuario $recolector)
    {
        abort_unless($recolector->role === 'recolector', 404);

        return Inertia::render('Admin/Recolectores/Edit', [
            'auth' => [
                'user' => auth()->user(), // ✅ mantiene contexto admin
            ],
            'recolector' => $recolector,
        ]);
    }

    /**
     * 🔁 Actualizar datos del recolector
     */
    public function update(Request $request, Usuario $recolector)
    {
        abort_unless($recolector->role === 'recolector', 404);

        $data = $request->validate([
            'nombres'   => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email'     => 'required|email|unique:usuarios,email,' . $recolector->id,
            'estado'    => 'required|string|in:activo,inactivo,pendiente',
            'password'  => 'nullable|string|min:6',
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $recolector->update($data);

        return redirect()
            ->route('admin.recolectores.index')
            ->with('success', '✅ Recolector actualizado correctamente.');
    }

    /**
     * 🗑️ Eliminar un recolector
     */
    public function destroy(Usuario $recolector)
    {
        abort_unless($recolector->role === 'recolector', 404);

        $recolector->delete();

        return redirect()
            ->route('admin.recolectores.index')
            ->with('success', '🗑️ Recolector eliminado correctamente.');
    }

    /**
     * 🧾 Exportar reporte PDF
     */
    public function exportarPDF()
    {
        $recolectores = Usuario::where('role', 'recolector')
            ->select('id', 'nombres', 'apellidos', 'email', 'puntaje', 'rating_promedio', 'estado')
            ->orderBy('nombres')
            ->get();

        $activos = $recolectores->where('estado', 'activo')->count();
        $inactivos = $recolectores->where('estado', 'inactivo')->count();
        $pendientes = $recolectores->where('estado', 'pendiente')->count();

        $pdf = Pdf::loadView('pdfs.reporte_recolectores', [
            'recolectores' => $recolectores,
            'activos' => $activos,
            'inactivos' => $inactivos,
            'pendientes' => $pendientes,
            'fecha' => now()->format('d/m/Y H:i'),
        ])->setPaper('a4', 'portrait');

        return $pdf->stream('Reporte_Recolectores_' . now()->format('Ymd_His') . '.pdf');
    }
}
