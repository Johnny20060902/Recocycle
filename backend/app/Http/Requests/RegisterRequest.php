<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\PasswordISO;     // 👉 regla de contraseñas ISO-27001

class RegisterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nombres'   => ['required', 'string', 'max:255'],
            'apellidos' => ['required', 'string', 'max:255'],

            // Teléfono opcional, validado y sin romper tu flujo
            'telefono'  => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s()]+$/'],

            'genero'    => ['nullable', 'string', 'max:20'],

            // Email normalizado + único
            'email'     => [
                'required',
                'email',
                'max:255',
                'unique:usuarios,email'
            ],

            // Contraseña endurecida con ISO-27001
            'password'  => [
                'required',
                'confirmed',
                new PasswordISO,
            ],
        ];
    }

    /**
     * Normalización de datos antes de validar
     */
    protected function prepareForValidation()
    {
        if ($this->email) {
            $this->merge([
                'email' => strtolower($this->email),
            ]);
        }
    }
}
