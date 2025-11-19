<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RankingController extends Controller
{
    /**
     * Ranking general (usuarios o recolectores)
     * Filtros:
     *  - ?tipo=recolectores|usuarios (default: recolectores)
     *  - ?per_page= (default: 20)
     *  - ?q= (búsqueda por nombre/apellido)
     */
    public function index(Request $request)
    {
      $tipo    = $request->query('tipo', 'recolectores');
      $perPage = (int) ($request->query('per_page', 20));
      $q       = trim((string) $request->query('q', ''));

      $role = $tipo === 'usuarios' ? 'usuario' : 'recolector';

      $query = Usuario::query()
          ->where('role', $role)
          ->select(['id', 'nombres', 'apellidos', 'email', 'role', 'puntaje', 'rating_promedio'])
          ->when($q !== '', function ($qBuilder) use ($q) {
              $qBuilder->where(function ($w) use ($q) {
                  $w->where('nombres', 'ILIKE', "%{$q}%")
                    ->orWhere('apellidos', 'ILIKE', "%{$q}%");
              });
          })
          ->orderByDesc('rating_promedio')
          ->orderByDesc('puntaje');

      $items = $query->paginate($perPage)->withQueryString();

      if ($request->expectsJson()) {
          return response()->json([
              'items' => $items,
              'tipo'  => $tipo,
          ]);
      }

      return Inertia::render('Admin/Ranking/Index', [
          'items'   => $items,
          'tipo'    => $tipo,
          'filters' => [
              'q'        => $q,
              'per_page' => $perPage,
          ],
      ]);
    }

    /**
     * 🔧 Ajustar puntaje de un solo usuario
     * POST admin/ranking/{usuario}/puntaje
     * body: tipo=percent|reset|set, valor (opcional)
     */
    public function actualizarPuntaje(Request $request, Usuario $usuario)
    {
        $data = $request->validate([
            'tipo'  => 'required|in:percent,reset,set',
            'valor' => 'nullable|numeric|min:0',
        ]);

        $tipo  = $data['tipo'];
        $valor = $data['valor'] ?? null;

        $puntajeActual = (int) $usuario->puntaje;
        $nuevo = $puntajeActual;

        switch ($tipo) {
            case 'percent':
                if ($valor === null) {
                    return back()->with('error', 'Debe indicar el porcentaje.');
                }
                // Reducir % y no bajar de 0
                $factor = max(0, 1 - ($valor / 100));
                $nuevo  = (int) floor($puntajeActual * $factor);
                break;

            case 'reset':
                $nuevo = 0;
                break;

            case 'set':
                $nuevo = (int) $valor;
                if ($nuevo < 0) {
                    $nuevo = 0;
                }
                break;
        }

        $usuario->update([
            'puntaje' => $nuevo,
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'puntaje' => $nuevo,
            ]);
        }

        return back()->with('success', 'Puntaje actualizado correctamente.');
    }

    /**
     * 🔧 Ajuste MASIVO de puntaje
     * POST admin/ranking/puntaje-masivo
     * body: ids[]=, tipo=percent|reset|set, valor (opcional)
     */
    public function actualizarPuntajeMasivo(Request $request)
    {
        $data = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer|exists:usuarios,id',
            'tipo'  => 'required|in:percent,reset,set',
            'valor' => 'nullable|numeric|min:0',
        ]);

        $ids   = $data['ids'];
        $tipo  = $data['tipo'];
        $valor = $data['valor'] ?? null;

        DB::transaction(function () use ($ids, $tipo, $valor) {
            $usuarios = Usuario::whereIn('id', $ids)->get();

            foreach ($usuarios as $usuario) {
                $puntajeActual = (int) $usuario->puntaje;
                $nuevo = $puntajeActual;

                switch ($tipo) {
                    case 'percent':
                        if ($valor === null) {
                            continue 2;
                        }
                        $factor = max(0, 1 - ($valor / 100));
                        $nuevo  = (int) floor($puntajeActual * $factor);
                        break;

                    case 'reset':
                        $nuevo = 0;
                        break;

                    case 'set':
                        $nuevo = (int) $valor;
                        if ($nuevo < 0) {
                            $nuevo = 0;
                        }
                        break;
                }

                $usuario->update(['puntaje' => $nuevo]);
            }
        });

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Puntajes actualizados correctamente.',
            ]);
        }

        return back()->with('success', 'Puntajes actualizados correctamente.');
    }
}
