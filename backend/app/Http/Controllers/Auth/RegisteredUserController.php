<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;          // 👉 Request seguro ISO
use App\Models\Usuario;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return inertia('Auth/Register');
    }

    /**
     * 🔐 Registro seguro compatible con ISO 27001
     */
    public function store(RegisterRequest $request)
    {
        // 🚀 Validación centralizada (con PasswordISO)
        $validated = $request->validated();

        // ✨ Crear usuario seguro
        $user = Usuario::create([
            'nombres'   => $validated['nombres'],
            'apellidos' => $validated['apellidos'],
            'telefono'  => $validated['telefono'] ?? null,
            'genero'    => $validated['genero'] ?? null,
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
        ]);

        // 🔔 Evento Breeze
        event(new Registered($user));

        // 🔑 Autologin
        Auth::login($user);

        // 👉 Redirección al dashboard correcto
        return redirect()->route('usuario.dashboard');
    }
}
