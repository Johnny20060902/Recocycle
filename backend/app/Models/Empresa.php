<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Empresa extends Model
{
    use HasFactory;

    protected $table = 'empresas';

    /**
     * Campos permitidos para asignación masiva
     */
    protected $fillable = [
        'nombre',
        'correo',
        'contacto',
        'logo',
        'activo',
        'categorias',
    ];


    /**
     * Convertir automáticamente el campo categorias a array al obtenerlo
     */
    protected $casts = [
        'categorias' => 'array',
        'activo' => 'boolean',
    ];

    /**
     * Encripta la contraseña automáticamente al asignarla
     */
    public function setPasswordAttribute($value)
    {
        if ($value && !Hash::needsRehash($value)) {
            $this->attributes['password'] = Hash::make($value);
        }
    }

    /**
     * Devuelve la URL completa del logo (para vistas o APIs)
     */
    public function getLogoUrlAttribute()
    {
        return $this->logo ? asset('storage/' . $this->logo) : asset('images/default-logo.png');
    }

    public function usuario()
{
    return $this->belongsTo(Usuario::class, 'usuario_id');
}

}
