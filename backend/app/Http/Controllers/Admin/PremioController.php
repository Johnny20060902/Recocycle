<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Premio;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PremioController extends Controller
{
    /**
     * 📋 Listado de premios (solo para administradores)
     */
    public function index()
    {
        $premios = Premio::latest()->get();

        return Inertia::render('Admin/Premios/Index', [
            'premios' => $premios,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    /**
     * 🆕 Formulario de creación de premio
     */
    public function create()
    {
        return Inertia::render('Admin/Premios/Create', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    /**
     * 💾 Guardar un nuevo premio
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre'       => 'required|string|max:255',
            'fecha_limite' => 'required|date',
            // 🔓 Aceptar cualquier tipo de archivo (imágenes, PDF, videos, etc.) hasta 100 MB
            'archivo'      => 'nullable|file|max:102400',
            'activo'       => 'nullable|boolean',
        ]);

        try {
            $archivo = null;

            // 📂 Guardar archivo si existe
            if ($request->hasFile('archivo')) {
                $archivo = $request->file('archivo')->store('premios', 'public');
            }

            Premio::create([
                'nombre'       => $request->nombre,
                'fecha_limite' => $request->fecha_limite,
                'archivo'      => $archivo,
                'activo'       => $request->activo ?? true, // por defecto activo
            ]);

            return redirect()
                ->route('admin.premios.index')
                ->with('success', '✅ Premio registrado correctamente.');
        } catch (\Exception $e) {
            // 🧯 Manejo de errores con retroalimentación visual
            return back()
                ->with('error', '❌ No se pudo subir el anuncio. Intenta nuevamente.')
                ->withInput();
        }
    }

    /**
     * 🗑️ Eliminar un premio
     */
    public function destroy(Premio $premio)
    {
        // 🧹 Eliminar archivo físico si existe
        if ($premio->archivo && Storage::disk('public')->exists($premio->archivo)) {
            Storage::disk('public')->delete($premio->archivo);
        }

        $premio->delete();

        return redirect()
            ->route('admin.premios.index')
            ->with('success', '🗑️ Premio eliminado correctamente.');
    }
}
