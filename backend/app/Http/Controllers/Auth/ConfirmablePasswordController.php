<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ConfirmablePasswordController extends Controller
{
    /**
     * Mostrar vista de confirmación de contraseña.
     */
    public function show(): Response
    {
        return Inertia::render('Auth/ConfirmPassword');
    }

    /**
     * Confirmar la contraseña del usuario.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Validación segura de contraseña actual
        if (! Auth::guard('web')->validate([
            'email'    => $user->email,
            'password' => $request->password,
        ])) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'),
            ]);
        }

        // Registrar timestamp de confirmación
        $request->session()->put('auth.password_confirmed_at', time());

        // Redirección correcta según rol
        switch ($user->role) {
            case 'admin':
                return redirect()->intended(route('admin.dashboard'));

            case 'recolector':
                return redirect()->intended(route('recolector.dashboard'));

            default:
                return redirect()->intended(route('usuario.dashboard'));
        }
    }
}
