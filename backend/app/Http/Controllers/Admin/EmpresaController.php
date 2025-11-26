<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use App\Rules\PasswordISO;

class EmpresaController extends Controller
{
    /**
     * 📋 Listado de empresas
     */
    public function index()
    {
        return Inertia::render('Admin/Empresas/Index', [
            'empresas' => Empresa::with('usuario')->get(),
        ]);
    }

    /**
     * 🏗️ Formulario para crear nueva empresa
     */
    public function create()
    {
        return Inertia::render('Admin/Empresas/Create');
    }

    /**
     * 💾 Registrar Empresa + Crear usuario recolector + Vincular empresa.usuario_id
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'     => 'required|string|max:255',
            'correo'     => 'required|email|unique:empresas,correo|unique:usuarios,email',
            'contacto'   => 'nullable|string|max:20',
            'logo'       => 'nullable|image|mimes:jpg,png,jpeg|max:4096',
            'categorias' => 'nullable|array',
            'password'   => ['required', 'confirmed', new PasswordISO],
        ]);

        // 📷 Logo
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // 👤 Crear usuario recolector asociado
        $usuario = Usuario::create([
            'nombres'         => $data['nombre'],
            'apellidos'       => 'Empresa',
            'telefono'        => $data['contacto'] ?? null,
            'genero'          => 'No especificado',
            'email'           => $data['correo'],
            'password'        => Hash::make($data['password']),
            'role'            => 'recolector',
            'estado'          => 'activo',
            'puntaje'         => 0,
            'rating_promedio' => 0,
        ]);

        // 🏢 Crear empresa y vinculación obligatoria usuario_id
        Empresa::create([
            'usuario_id' => $usuario->id,
            'nombre'     => $data['nombre'],
            'correo'     => $data['correo'],
            'contacto'   => $data['contacto'],
            'logo'       => $logoPath,
            'categorias' => json_encode($data['categorias'] ?? []),
            'activo'     => true,
        ]);

        return redirect()
            ->route('admin.empresas.index')
            ->with('success', 'Empresa registrada y recolector creado correctamente.');
    }

    /**
     * ✏️ Formulario edición
     */
    public function edit(Empresa $empresa)
    {
        return Inertia::render('Admin/Empresas/Edit', [
            'empresa' => $empresa->load('usuario'),
        ]);
    }

    /**
     * 🔁 Actualizar empresa + usuario vinculado
     */
    public function update(Request $request, Empresa $empresa)
    {
        $data = $request->validate([
            'nombre'     => 'required|string|max:255',
            'correo'     => 'required|email|unique:empresas,correo,' . $empresa->id,
            'contacto'   => 'nullable|string|max:20',
            'logo'       => 'nullable|image|mimes:jpg,png,jpeg|max:4096',
            'categorias' => 'nullable|array',
            'activo'     => 'boolean',
            'password'   => ['nullable', 'confirmed', new PasswordISO],
        ]);

        // 📷 Logo
        $logoPath = $empresa->logo;
        if ($request->hasFile('logo')) {
            if ($logoPath && Storage::disk('public')->exists($logoPath)) {
                Storage::disk('public')->delete($logoPath);
            }
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // Obtener usuario vinculado (RECOLECTOR)
        $usuario = Usuario::where('id', $empresa->usuario_id)
            ->where('role', 'recolector')
            ->first();

        // 👉 Guardar correo viejo para detectar cambios
        $oldCorreo = $empresa->correo;

        // 🏢 Actualizar empresa
        $empresa->update([
            'nombre'     => $data['nombre'],
            'correo'     => $data['correo'],
            'contacto'   => $data['contacto'],
            'logo'       => $logoPath,
            'categorias' => json_encode($data['categorias'] ?? []),
            'activo'     => $request->boolean('activo'),
        ]);

        // 👤 Sincronizar usuario
        if ($usuario) {
            $usuario->update([
                'nombres'  => $data['nombre'],
                'email'    => $data['correo'],
                'telefono' => $data['contacto'] ?? $usuario->telefono,
                'estado'   => $request->boolean('activo') ? 'activo' : 'inactivo',
                'password' => $request->filled('password')
                    ? Hash::make($data['password'])
                    : $usuario->password,
            ]);
        }

        return redirect()
            ->route('admin.empresas.index')
            ->with('success', 'Empresa y recolector actualizados correctamente.');
    }

    /**
     * 🗑️ Eliminar empresa + logo + usuario recolector vinculado
     */
    public function destroy(Empresa $empresa)
    {
        // Borrar logo físico
        if ($empresa->logo && Storage::disk('public')->exists($empresa->logo)) {
            Storage::disk('public')->delete($empresa->logo);
        }

        // Eliminar usuario asociado
        Usuario::where('id', $empresa->usuario_id)->delete();

        // Eliminar empresa
        $empresa->delete();

        return back()->with('success', 'Empresa y usuario recolector eliminados correctamente.');
    }
}
