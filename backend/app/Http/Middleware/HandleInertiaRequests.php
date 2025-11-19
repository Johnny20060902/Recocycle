<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * 🌐 Vista raíz para Inertia
     */
    protected $rootView = 'app';

    /**
     * 🔢 Versión de los assets (mantener)
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * 🧩 Datos compartidos globalmente con todas las vistas Inertia
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            // ✅ Datos del usuario autenticado
            'auth' => [
                'user' => $request->user() ? [
                    'id'         => $request->user()->id,
                    'nombres'    => $request->user()->nombres,
                    'apellidos'  => $request->user()->apellidos,
                    'email'      => $request->user()->email,
                    'role'       => $request->user()->role,
                    'estado'     => $request->user()->estado,
                    'puntaje'    => $request->user()->puntaje,
                    'rating'     => $request->user()->rating_promedio,
                ] : null,
            ],

            // ✅ Mensajes flash (éxito y error)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
