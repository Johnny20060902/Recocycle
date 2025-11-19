<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reciclaje extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'categoria_id',
        'descripcion',
        'registros',
        'latitud',
        'longitud',
        'imagenes_url',
        'estado',
    ];

    protected $casts = [
        'registros' => 'array',
        'imagenes_url' => 'array',
    ];

    // 🔗 Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    // 🔗 Un reciclaje puede generar un punto de recolección
    public function puntoRecoleccion()
    {
        return $this->hasOne(PuntoRecoleccion::class, 'reciclaje_id');
    }
    public function getRegistrosAttribute($value)
    {
        if (is_array($value)) {
            return $value;
        }

        $decoded = json_decode($value, true);

        return is_array($decoded) ? $decoded : [];
    }
}
