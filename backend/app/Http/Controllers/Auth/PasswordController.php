<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    /**
     * Actualiza la contraseña del usuario (Panel Perfil).
     * Validación y seguridad ISO-27001 en UpdatePasswordRequest.
     */
    public function update(UpdatePasswordRequest $request)
    {
        $user = $request->user();

        // 🔐 Actualizar contraseña de forma segura
        $user->update([
            'password' => Hash::make($request->validated()['password']),
        ]);

        // 🔒 Regenerar token de sesión por seguridad
        $request->session()->regenerateToken();

        return back()->with('success', 'Contraseña actualizada correctamente.');
    }
}
