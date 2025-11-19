<?php

namespace App\Http\Controllers\Usuario;

use App\Http\Controllers\Controller;
use App\Models\Premio;
use Inertia\Inertia;

class PremioController extends Controller
{
    /**
     * 🎁 Listado de premios visibles para usuarios
     */
    public function index()
    {
        $premios = Premio::where('activo', true)
            ->latest()
            ->get();

        return Inertia::render('Usuario/Premios/Index', [
            'premios' => $premios,
            'auth'    => auth()->user(),
        ]);
    }
}
