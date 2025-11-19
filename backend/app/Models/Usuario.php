<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;

class Usuario extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'nombres',
        'apellidos',
        'telefono',
        'genero',
        'email',
        'password',
        'role',             // admin | recolector | usuario
        'estado',           // activo | inactivo | pendiente
        'puntaje',
        'rating_promedio',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'rating_promedio' => 'float',
    ];

    /*
    |--------------------------------------------------------------------------
    | 🔐 Hash automático de contraseña (Producción OK)
    |--------------------------------------------------------------------------
    */
    public function setPasswordAttribute($value)
    {
        if (!empty($value) && !str_starts_with($value, '$2y$')) {
            $this->attributes['password'] = Hash::make($value);
        } else {
            $this->attributes['password'] = $value;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | 🔢 Campos Calculados (Appends)
    |--------------------------------------------------------------------------
    */
    protected $appends = [
        'rating_promedio_live',
        'rating_stars',
        'rating_percent',
        'nombre_completo',
    ];

    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombres} {$this->apellidos}";
    }

    public function getRatingPromedioLiveAttribute(): float
    {
        $avg = $this->calificacionesRecibidas()->avg('puntaje');
        return round($avg ?? 0, 2);
    }

    public function getRatingStarsAttribute(): array
    {
        $value = $this->rating_promedio_live;
        $filled = (int) floor($value);
        $decimal = $value - $filled;
        $half = $decimal >= 0.25 && $decimal < 0.75;
        $empty = 5 - $filled - ($half ? 1 : 0);

        return [
            'filled' => $filled,
            'half'   => $half,
            'empty'  => $empty,
            'value'  => $value,
        ];
    }

    public function getRatingPercentAttribute(): int
    {
        return (int) round(($this->rating_promedio_live / 5) * 100);
    }

    /*
    |--------------------------------------------------------------------------
    | 🔗 Relaciones
    |--------------------------------------------------------------------------
    */
    public function reciclajes()
    {
        return $this->hasMany(Reciclaje::class, 'usuario_id');
    }

    public function puntosCreados()
    {
        return $this->hasMany(PuntoRecoleccion::class, 'usuario_id');
    }

    public function puntosRecolectados()
    {
        return $this->hasMany(PuntoRecoleccion::class, 'recolector_id');
    }

    public function calificacionesRecibidas()
    {
        return $this->hasMany(Calificacion::class, 'evaluado_id');
    }

    public function calificacionesEmitidas()
    {
        return $this->hasMany(Calificacion::class, 'evaluador_id');
    }

    /*
    |--------------------------------------------------------------------------
    | ⭐ Promedio persistente
    |--------------------------------------------------------------------------
    */
    public function actualizarPromedio()
    {
        $promedio = $this->calificacionesRecibidas()->avg('puntaje') ?? 0;
        $this->update(['rating_promedio' => round($promedio, 2)]);
    }

    /*
    |--------------------------------------------------------------------------
    | 🔍 Scopes
    |--------------------------------------------------------------------------
    */
    public function scopeOrderByReputacion($query)
    {
        return $query->orderByDesc('rating_promedio')->orderByDesc('puntaje');
    }

    /*
    |--------------------------------------------------------------------------
    | 🏢 Relación Empresa
    |--------------------------------------------------------------------------
    */
    public function empresa()
    {
        return $this->hasOne(Empresa::class, 'usuario_id');
    }
}
