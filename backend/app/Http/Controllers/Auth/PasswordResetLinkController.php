<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Mostrar vista de solicitud de enlace de restablecimiento.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Procesar solicitud de enlace de restablecimiento.
     */
    public function store(Request $request): RedirectResponse
    {
        // Validación básica (sin revelar existencia del usuario)
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Intentar enviar link de reset (Laravel gestiona seguridad internamente)
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return back()->with('status', __($status));
        }

        // Evitar enumeración de emails → mensaje genérico
        throw ValidationException::withMessages([
            'email' => [__('No fue posible enviar el enlace de recuperación.')],
        ]);
    }
}
