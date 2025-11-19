<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Mostrar el mensaje de verificación de email.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {

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

        // Si NO está verificado → mostrar pantalla VerifyEmail
        return Inertia::render('Auth/VerifyEmail', [
            'status' => session('status'),
        ]);
    }
}
