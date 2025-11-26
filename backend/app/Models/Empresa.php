<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class Empresa extends Model
{
    use HasFactory;

    protected $table = 'empresas';

    /**
     * Campos permitidos para asignación masiva
     */
    protected $fillable = [
        'usuario_id',   // ✅ FALTABA ESTO
        'nombre',
        'correo',
        'contacto',
        'logo',
        'activo',
        'categorias',
    ];

    /**
     * Casts automáticos
     */
    protected $casts = [
        'categorias' => 'array',
        'activo'     => 'boolean',
    ];

    /**
     * Accesor para obtener el logo completo
     */
    public function getLogoUrlAttribute()
    {
        if (!$this->logo) {
            return asset('images/default-logo.png');
        }

        // Verificar que exista en storage
        if (Storage::disk('public')->exists($this->logo)) {
            return asset('storage/' . $this->logo);
        }

        return asset('images/default-logo.png');
    }

    /**
     * Relación con usuario (recolector)
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
