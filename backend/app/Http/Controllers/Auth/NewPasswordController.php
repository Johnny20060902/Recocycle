<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Rules\PasswordISO;

class NewPasswordController extends Controller
{
    /**
     * Mostrar formulario de nueva contraseña.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    /**
     * Procesar el cambio de contraseña.
     */
    public function store(Request $request): RedirectResponse
    {
        // Validación robusta
        $request->validate([
            'token'    => ['required'],
            'email'    => ['required', 'email'],
            'password' => [
                'required',
                'confirmed',
                new PasswordISO,   // seguridad ISO-27001
            ],
        ]);

        // Reset estándar de Laravel
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password'       => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        // Si se reseteó correctamente
        if ($status === Password::PASSWORD_RESET) {
            return redirect()
                ->route('login')   // login universal → funciona para todos tus roles
                ->with('status', __('passwords.reset'));
        }

        // Error controlado
        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }
}
