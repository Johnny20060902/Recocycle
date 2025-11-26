<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PuntoRecoleccion extends Model
{
    use HasFactory;

    protected $table = 'punto_recoleccions';

    protected $fillable = [
        'usuario_id',
        'reciclaje_id',
        'recolector_id',
        'latitud',
        'longitud',
        'material',
        'peso',
        'descripcion',
        'fecha',
        'fecha_disponible',
        'hora_desde',
        'hora_hasta',
        'estado',

        // 🆕 CAMPOS DE SOLICITUD (faltaban en tu modelo)
        'solicitud_estado',
        'solicitud_fecha',
        'solicitud_hora_desde',
        'solicitud_hora_hasta',

        // 🆕 FOTO FINAL (faltaba)
        'foto_final',

        // Tiempos del flujo
        'aceptado_at',
        'recogido_at',
        'completado_at',

        'codigo',
    ];

    protected $casts = [
        'aceptado_at'   => 'datetime',
        'recogido_at'   => 'datetime',
        'completado_at' => 'datetime',
    ];

    /** Relaciones principales */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function reciclaje()
    {
        return $this->belongsTo(Reciclaje::class, 'reciclaje_id');
    }

    public function recolector()
    {
        return $this->belongsTo(Usuario::class, 'recolector_id');
    }

    public function calificaciones()
    {
        return $this->hasMany(Calificacion::class, 'punto_recoleccion_id');
    }

    /** Helpers del flujo */
    public function puedeSerTomadoPor(Usuario $usuario): bool
    {
        return $this->estado === 'pendiente' && $usuario->role === 'recolector';
    }

    public function estaCompletado(): bool
    {
        return $this->estado === 'completado';
    }

    /** Nombre legible del estado */
    public function getEstadoTextoAttribute(): string
    {
        return match ($this->estado) {
            'pendiente'  => 'Pendiente',
            'asignado'   => 'Asignado',
            'en_camino'  => 'En camino',
            'recogido'   => 'Recogido',
            'completado' => 'Completado',
            'cancelado'  => 'Cancelado',
            default      => 'Desconocido',
        };
    }
}
