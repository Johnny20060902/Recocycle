<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use App\Models\Usuario;
use App\Models\Categoria;
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
            'empresas' => Empresa::with(['usuario','categorias'])->orderBy('id','desc')->get(),
        ]);
    }

    /**
     * 🏗️ Formulario para crear nueva empresa
     */
    public function create()
    {
        return Inertia::render('Admin/Empresas/Create', [
            'categorias' => Categoria::select('id','nombre')->orderBy('nombre')->get()
        ]);
    }

    /**
     * 💾 Registrar Empresa + Crear usuario recolector
     */
    public function store(Request $request)
    {   
        $data = $request->validate([
            'nombre'                 => 'required|string|max:255',
            'correo'                 => 'required|email|unique:empresas,correo|unique:usuarios,email',
            'contacto'               => 'nullable|string|max:20',
            'logo'                   => 'nullable|image|mimes:jpg,png,jpeg|max:4096',

            // AHORA categorías son ARRAY de IDs reales
            'categorias'             => 'required|array',
            'categorias.*'           => 'exists:categorias,id',

            'password'               => ['required', 'confirmed', new PasswordISO],
            'password_confirmation'  => 'required'
        ]);

        // 📷 Guardar logo si existe
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // 👤 Crear usuario recolector
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

        // 🏢 Crear empresa
        $empresa = Empresa::create([
            'usuario_id' => $usuario->id,
            'nombre'     => $data['nombre'],
            'correo'     => $data['correo'],
            'contacto'   => $data['contacto'],
            'logo'       => $logoPath,
            'activo'     => true,
        ]);

        // 🔗 Asignar categorías en tabla pivote
        $empresa->categorias()->sync($data['categorias']);

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
            'empresa'    => $empresa->load(['usuario','categorias']),
            'categorias' => Categoria::select('id','nombre')->orderBy('nombre')->get(),
        ]);
    }

    /**
     * 🔁 Actualizar empresa + usuario vinculado
     */
    public function update(Request $request, Empresa $empresa)
    {
        $data = $request->validate([
            'nombre'                 => 'required|string|max:255',
            'correo'                 => 'required|email|unique:empresas,correo,' . $empresa->id,
            'contacto'               => 'nullable|string|max:20',
            'logo'                   => 'nullable|image|mimes:jpg,png,jpeg|max:4096',

            'categorias'             => 'required|array',
            'categorias.*'           => 'exists:categorias,id',

            'activo'                 => 'boolean',
            'password'               => ['nullable', 'confirmed', new PasswordISO],
            'password_confirmation'  => 'nullable|required_with:password'
        ]);

        // 📷 Logo
        $logoPath = $empresa->logo;
        if ($request->hasFile('logo')) {
            if ($logoPath && Storage::disk('public')->exists($logoPath)) {
                Storage::disk('public')->delete($logoPath);
            }
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // Usuario asociado
        $usuario = Usuario::find($empresa->usuario_id);

        // 🏢 Actualizar empresa
        $empresa->update([
            'nombre'     => $data['nombre'],
            'correo'     => $data['correo'],
            'contacto'   => $data['contacto'],
            'logo'       => $logoPath,
            'activo'     => $request->boolean('activo'),
        ]);

        // 🔗 Actualizar categorías pivote
        $empresa->categorias()->sync($data['categorias']);

        // 👤 Actualizar usuario vinculado
        if ($usuario) {
            $usuario->update([
                'nombres'  => $data['nombre'],
                'email'    => $data['correo'],
                'telefono' => $data['contacto'],
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
     * 🗑️ Eliminar empresa + usuario recolector vinculado
     */
    public function destroy(Empresa $empresa)
    {
        // borrar logo
        if ($empresa->logo && Storage::disk('public')->exists($empresa->logo)) {
            Storage::disk('public')->delete($empresa->logo);
        }

        // eliminar usuario asociado
        Usuario::where('id', $empresa->usuario_id)->delete();

        // eliminar empresa
        $empresa->delete();

        return back()->with('success', 'Empresa y usuario recolector eliminados correctamente.');
    }
}
