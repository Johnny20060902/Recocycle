<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Marcar el email del usuario como verificado.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();

        // Si ya estaba verificado → solo redirigir
        if ($user->hasVerifiedEmail()) {
            return $this->redirectSegunRol($user);
        }

        // Verificar email y disparar evento
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return $this->redirectSegunRol($user);
    }

    /**
     * Redirección limpia según el rol del usuario.
     */
    private function redirectSegunRol($user): RedirectResponse
    {
        $query = '?verified=1';

        switch ($user->role) {
            case 'admin':
                return redirect()->intended(route('admin.dashboard') . $query);

            case 'recolector':
                return redirect()->intended(route('recolector.dashboard') . $query);

            default:
                return redirect()->intended(route('usuario.dashboard') . $query);
        }
    }
}
