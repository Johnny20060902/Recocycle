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
        $empresas = Empresa::all();

        return Inertia::render('Admin/Empresas/Index', [
            'empresas' => $empresas,
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
     * 💾 Guardar nueva empresa + usuario asociado
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'     => 'required|string|max:255',
            'correo'     => 'required|email|unique:empresas,correo|unique:usuarios,email',
            'contacto'   => 'nullable|string|max:20',
            'logo'       => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'categorias' => 'nullable|array',

            // 🔐 ISO 27001 + confirmed
            'password'   => ['required', 'confirmed', new PasswordISO],
        ]);

        // 📷 Logo
        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('logos', 'public');
        }

        // 🏢 Crear empresa
        $empresa = Empresa::create([
            'nombre'     => $data['nombre'],
            'correo'     => $data['correo'],
            'contacto'   => $data['contacto'],
            'logo'       => $data['logo'] ?? null,
            'categorias' => json_encode($data['categorias'] ?? []),
            'activo'     => true,
        ]);

        // 👤 Crear usuario recolector asociado
        Usuario::create([
            'nombres'         => $data['nombre'],
            'apellidos'       => 'Empresa',
            'telefono'        => $data['contacto'] ?? null,
            'genero'          => 'No especificado',
            'email'           => $data['correo'],
            'password'        => Hash::make($data['password']),
            'role'            => 'recolector',
            'estado'          => 'activo',
            'puntaje'         => 0,
            'rating_promedio' => 0.0,
        ]);

        return redirect()
            ->route('admin.empresas.index')
            ->with('success', 'Empresa registrada correctamente y usuario creado.');
    }

    /**
     * ✏️ Formulario de edición de empresa
     */
    public function edit(Empresa $empresa)
    {
        return Inertia::render('Admin/Empresas/Edit', [
            'empresa' => $empresa,
        ]);
    }

    /**
     * 🔁 Actualizar empresa + usuario vinculado
     */
    public function update(Request $request, Empresa $empresa)
    {
        // Validación principal
        $data = $request->validate([
            'nombre'     => 'required|string|max:255',
            'correo'     => 'required|email|unique:empresas,correo,' . $empresa->id,
            'contacto'   => 'nullable|string|max:20',
            'logo'       => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'categorias' => 'nullable|array',
            'activo'     => 'boolean',
        ]);

        // Validación de contraseña SOLO si se envía
        if ($request->filled('password')) {
            $request->validate([
                'password' => ['nullable', 'confirmed', new PasswordISO],
            ]);
        }

        // 📷 Logo
        $data['logo'] = $empresa->logo;
        if ($request->hasFile('logo')) {
            if ($empresa->logo && Storage::disk('public')->exists($empresa->logo)) {
                Storage::disk('public')->delete($empresa->logo);
            }
            $data['logo'] = $request->file('logo')->store('logos', 'public');
        }

        // Categorías como JSON
        $data['categorias'] = json_encode($data['categorias'] ?? []);
        $data['activo']     = $request->boolean('activo');

        // Guardar correo viejo
        $oldCorreo = $empresa->correo;

        // Actualizar empresa
        $empresa->update($data);

        // 👤 Sincronizar usuario asociado
        $usuario = Usuario::where('email', $oldCorreo)
            ->where('role', 'recolector')
            ->first();

        if ($usuario) {
            $usuario->nombres  = $data['nombre'];
            $usuario->telefono = $data['contacto'] ?? $usuario->telefono;
            $usuario->email    = $data['correo'];
            $usuario->estado   = $data['activo'] ? 'activo' : 'inactivo';

            if ($request->filled('password')) {
                $usuario->password = Hash::make($request->password);
            }

            $usuario->save();
        }

        return redirect()
            ->route('admin.empresas.index')
            ->with('success', 'Empresa actualizada correctamente.');
    }

    /**
     * 🗑️ Eliminar empresa
     */
    public function destroy(Empresa $empresa)
    {
        if ($empresa->logo && Storage::disk('public')->exists($empresa->logo)) {
            Storage::disk('public')->delete($empresa->logo);
        }

        $empresa->delete();

        return back()->with('success', 'Empresa eliminada correctamente.');
    }
}
