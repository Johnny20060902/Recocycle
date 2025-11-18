<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Imagen extends Model
{
    use HasFactory;

    protected $fillable = ['reciclaje_id', 'ruta'];

    public function reciclaje()
    {
        return $this->belongsTo(Reciclaje::class);
    }
}
