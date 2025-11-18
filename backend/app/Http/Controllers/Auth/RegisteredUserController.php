<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Usuario; // o Usuario, según cómo lo llamaste
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return inertia('Auth/Register');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombres' => ['required', 'string', 'max:255'],
            'apellidos' => ['required', 'string', 'max:255'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'genero' => ['nullable', 'string', 'max:20'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:usuarios,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = \App\Models\Usuario::create([
            'nombres' => $validated['nombres'],
            'apellidos' => $validated['apellidos'],
            'telefono' => $validated['telefono'] ?? null,
            'genero' => $validated['genero'] ?? null,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            // 🔹 puntaje se inicializa automáticamente a 0
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('usuario.dashboard');
    }
}
