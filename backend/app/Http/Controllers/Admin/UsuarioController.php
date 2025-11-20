<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use App\Rules\PasswordISO;

class UsuarioController extends Controller
{
    /**
     * 📋 Listado general de usuarios (solo para administradores)
     */
    public function index()
    {
        $usuarios = Usuario::select(
            'id',
            'nombres',
            'apellidos',
            'email',
            'role',
            'estado',
            'puntaje',
            'rating_promedio'
        )
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Admin/Usuarios/Index', [
            'usuarios' => $usuarios,
        ]);
    }

    /**
     * 🆕 Formulario de creación de usuario
     */
    public function create()
    {
        return Inertia::render('Admin/Usuarios/Create');
    }

    /**
     * 💾 Guardar nuevo usuario
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombres'   => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email'     => 'required|email|unique:usuarios,email',
            'role'      => 'required|string|in:admin,usuario,recolector',
            'estado'    => 'required|string|in:activo,inactivo,pendiente',

            // 🔐 ISO 27001 + confirmed
            'password'  => ['required', 'confirmed', new PasswordISO],
        ]);

        // Encriptar password
        $data['password'] = Hash::make($data['password']);

        Usuario::create($data);

        return redirect()
            ->route('admin.usuarios.index')
            ->with('success', '✅ Usuario creado correctamente.');
    }

    /**
     * ✏️ Formulario de edición de usuario
     */
    public function edit(Usuario $usuario)
    {
        return Inertia::render('Admin/Usuarios/Edit', [
            'usuario' => $usuario,
        ]);
    }

    /**
     * 🔁 Actualizar datos de un usuario
     */
    public function update(Request $request, Usuario $usuario)
    {
        $data = $request->validate([
            'nombres'   => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email'     => 'required|email|unique:usuarios,email,' . $usuario->id,
            'role'      => 'required|string|in:admin,usuario,recolector',
            'estado'    => 'required|string|in:activo,inactivo,pendiente',

            // 🔐 Contraseña opcional con ISO 27001
            'password'  => ['nullable', 'confirmed', new PasswordISO],
        ]);

        // Solo actualizar si fue enviada
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $usuario->update($data);

        return redirect()
            ->route('admin.usuarios.index')
            ->with('success', '✅ Usuario actualizado correctamente.');
    }

    /**
     * 🗑️ Eliminar usuario del sistema
     */
    public function destroy(Usuario $usuario)
    {
        $usuario->delete();

        return redirect()
            ->route('admin.usuarios.index')
            ->with('success', '🗑️ Usuario eliminado correctamente.');
    }
}
