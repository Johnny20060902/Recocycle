<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Autenticación segura con limitador de intentos (ISO 27001 + OWASP)
     */
    public function authenticate()
    {
        $this->ensureIsNotRateLimited();

        // 🔐 Usar guard "web" explícitamente (modelo Usuario)
        $authenticated = Auth::guard('web')->attempt(
            $this->only('email', 'password'),
            $this->boolean('remember')
        );

        if (! $authenticated) {

            // Registrar intento fallido
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => __('Credenciales incorrectas.'), // 👈 sin enumeración de usuarios
            ]);
        }

        // Reset de contador de intentos
        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Evitar fuerza bruta.
     */
    public function ensureIsNotRateLimited()
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => "Muchos intentos fallidos. Intente nuevamente en {$seconds} segundos."
        ]);
    }

    /**
     * Combinación email + IP → anti fuerza bruta distribuida.
     */
    public function throttleKey()
    {
        return Str::lower($this->input('email')) . '|' . $this->ip();
    }
}
