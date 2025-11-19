<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Enviar un nuevo correo de verificación.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        // Si ya está verificado → redirigir al dashboard correspondiente
        if ($user->hasVerifiedEmail()) {

            switch ($user->role) {
                case 'admin':
                    return redirect()->intended(route('admin.dashboard'));
                case 'recolector':
                    return redirect()->intended(route('recolector.dashboard'));
                default:
                    return redirect()->intended(route('usuario.dashboard'));
            }
        }

        // Enviar email de verificación nuevamente
        $user->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
