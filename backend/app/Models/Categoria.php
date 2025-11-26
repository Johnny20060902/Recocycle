<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'descripcion'];

    public function reciclajes()
    {
        return $this->hasMany(Reciclaje::class);
    }

    public function empresas()
    {
    return $this->belongsToMany(Empresa::class, 'categoria_empresa', 'categoria_id', 'empresa_id');
    }

}
