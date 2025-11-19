<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recoleccion extends Model
{
    use HasFactory;

    // 👇 Esto es CLAVE:
    protected $table = 'recolecciones';

    protected $fillable = [
        'recolector_id',
        'reciclaje_id',
        'peso_kg',
        'observaciones',
        'fecha_recoleccion',
    ];

    public function reciclaje()
    {
        return $this->belongsTo(Reciclaje::class);
    }

    public function recolector()
    {
        return $this->belongsTo(Usuario::class, 'recolector_id');
    }
}
