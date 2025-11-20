<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
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

            // Teléfono opcional pero validado
            'telefono'  => ['nullable', 'string', 'max:20', 'regex:/^[0-9+\-\s()]+$/'],

            'genero'    => ['nullable', 'string', 'max:20'],

            // Email seguro + normalizado + no duplica usuarios
            'email'     => [
                'required',
                'email',
                'max:255',
                'unique:usuarios,email,' . auth()->id(),
            ],
        ];
    }

    /**
     * Normalización de datos antes de validar (ISO-27001)
     */
    protected function prepareForValidation()
    {
        if ($this->email) {
            $this->merge([
                'email' => strtolower($this->email), // Email siempre consistente
            ]);
        }
    }
}
