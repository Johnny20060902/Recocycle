<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calificacion extends Model
{
    use HasFactory;

    protected $table = 'calificaciones';


    protected $fillable = [
        'punto_recoleccion_id',
        'evaluador_id',
        'evaluado_id',
        'rol_evaluador',
        'puntaje',
        'comentario',
    ];

    // 🔗 Relaciones
    public function punto()
    {
        return $this->belongsTo(PuntoRecoleccion::class, 'punto_recoleccion_id');
    }

    public function evaluador()
    {
        return $this->belongsTo(Usuario::class, 'evaluador_id');
    }

    public function evaluado()
    {
        return $this->belongsTo(Usuario::class, 'evaluado_id');
    }

    // 🧮 Actualizar promedio automáticamente al crear una nueva calificación
    protected static function booted()
    {
        static::created(function ($calificacion) {
            $evaluado = $calificacion->evaluado;
            if ($evaluado) {
                $promedio = $evaluado->calificacionesRecibidas()->avg('puntaje') ?? 0;
                $evaluado->update(['rating_promedio' => round($promedio, 2)]);
            }
        });
    }
}
