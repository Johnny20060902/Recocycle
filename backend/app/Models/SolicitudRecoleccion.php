<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolicitudRecoleccion extends Model
{
    use HasFactory;

    protected $table = 'solicitudes_recoleccion';

    protected $fillable = [
        'punto_id',
        'recolector_id',
        'usuario_id',
        'fecha_solicitada',
        'hora_solicitada',
        'estado',
    ];

    protected $casts = [
        'fecha_solicitada' => 'date',
        'hora_solicitada' => 'datetime:H:i',
    ];

    // 🔗 Relaciones
    public function punto()
    {
        return $this->belongsTo(PuntoRecoleccion::class);
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function recolector()
    {
        return $this->belongsTo(Usuario::class, 'recolector_id');
    }

    // 🧭 Scopes
    public function scopeEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    // 🧩 Accesores
    public function getEstadoTextoAttribute()
    {
        return match ($this->estado) {
            'pendiente' => '⏳ Pendiente de respuesta',
            'aceptada' => '✅ Aceptada',
            'rechazada' => '❌ Rechazada',
            default => ucfirst($this->estado),
        };
    }

    public function getEstadoColorAttribute()
    {
        return match ($this->estado) {
            'pendiente' => 'warning',
            'aceptada' => 'success',
            'rechazada' => 'danger',
            default => 'secondary',
        };
    }
}

