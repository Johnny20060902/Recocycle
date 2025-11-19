<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriaController extends Controller
{
    /**
     * 📋 Listar categorías
     */
    public function index()
    {
        $categorias = Categoria::latest()->get();

        return Inertia::render('Admin/Categorias/Index', [
            'auth' => [
                'user' => auth()->user(), // ✅ estructura correcta para evitar undefined
            ],
            'categorias' => $categorias,
        ]);
    }

    /**
     * 🆕 Formulario de creación
     */
    public function create()
    {
        return Inertia::render('Admin/Categorias/Create', [
            'auth' => [
                'user' => auth()->user(), // ✅ mantiene estructura uniforme
            ],
        ]);
    }

    /**
     * 💾 Guardar nueva categoría
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre',
            'descripcion' => 'nullable|string|max:1000',
        ]);

        Categoria::create($request->only('nombre', 'descripcion'));

        return redirect()
            ->route('admin.categorias.index')
            ->with('success', '✅ Categoría creada correctamente.');
    }

    /**
     * ✏️ Formulario de edición
     */
    public function edit(Categoria $categoria)
    {
        return Inertia::render('Admin/Categorias/Edit', [
            'auth' => [
                'user' => auth()->user(), // ✅ mantiene compatibilidad con tus layouts
            ],
            'categoria' => $categoria,
        ]);
    }

    /**
     * 🔄 Actualizar categoría
     */
    public function update(Request $request, Categoria $categoria)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre,' . $categoria->id,
            'descripcion' => 'nullable|string|max:1000',
        ]);

        $categoria->update($request->only('nombre', 'descripcion'));

        return redirect()
            ->route('admin.categorias.index')
            ->with('success', '✅ Categoría actualizada correctamente.');
    }

    /**
     * 🗑️ Eliminar categoría
     */
    public function destroy(Categoria $categoria)
    {
        $categoria->delete();

        return redirect()
            ->route('admin.categorias.index')
            ->with('success', '🗑️ Categoría eliminada correctamente.');
    }
}
