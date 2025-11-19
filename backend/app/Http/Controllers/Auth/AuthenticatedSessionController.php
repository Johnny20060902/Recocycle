<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Muestra la vista de inicio de sesión.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status'           => session('status'),
        ]);
    }

    /**
     * Procesa la autenticación de usuario.
     * Validación segura manejada en LoginRequest.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        Auth::shouldUse('web'); // 🔐 Usa el guard del modelo Usuario

        // 👉 LoginRequest ya maneja:
        // - Validación
        // - Intentos fallidos
        // - Rate limiting
        // - Excepciones limpias ISO

        $request->authenticate();   // 100% seguro

        $request->session()->regenerate();

        $user = Auth::guard('web')->user();

        // 🔄 Redirección según rol
        switch ($user->role) {
            case 'admin':
                return redirect()->intended(route('admin.dashboard'));
            case 'recolector':
                return redirect()->intended(route('recolector.dashboard'));
            default:
                return redirect()->intended(route('usuario.dashboard'));
        }
    }

    /**
     * Cierra la sesión autenticada.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
