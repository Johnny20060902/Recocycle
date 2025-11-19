<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Http;

class PasswordISO implements Rule
{
    public function passes($attribute, $value)
    {
        // Normalizar (evitar espacios raros)
        $value = trim($value);

        // 1️⃣ Longitud mínima
        if (strlen($value) < 8) return false;

        // 2️⃣ Requisitos de complejidad
        if (!preg_match('/[A-Z]/', $value)) return false;
        if (!preg_match('/[a-z]/', $value)) return false;
        if (!preg_match('/[0-9]/', $value)) return false;
        if (!preg_match('/[@$!%*#?&]/', $value)) return false;

        // 3️⃣ Verificación con HaveIBeenPwned
        try {
            $hash = strtoupper(sha1($value));
            $prefix = substr($hash, 0, 5);

            $response = Http::timeout(5)->get(
                "https://api.pwnedpasswords.com/range/{$prefix}"
            );

            if ($response->failed()) {
                // Si falla la API, no bloqueamos la contraseña
                return true;
            }

            // Si aparece en la lista → contraseña vulnerable
            return !str_contains($response->body(), substr($hash, 5));
        } catch (\Exception $e) {
            // Si hay error de red o SSL → permitir contraseña por falla externa
            return true;
        }
    }

    public function message()
    {
        return "La contraseña no cumple las políticas de seguridad ISO-27001. 
Debe tener mínimo 8 caracteres, mayúscula, minúscula, número, símbolo y no ser una contraseña filtrada.";
    }
}
