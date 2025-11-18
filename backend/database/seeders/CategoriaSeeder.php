<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categorias')->insert([
            ['nombre' => 'Cartón', 'descripcion' => 'Cajas, empaques y materiales de cartón reciclable.'],
            ['nombre' => 'Plástico', 'descripcion' => 'Botellas, envases, bolsas y otros plásticos.'],
            ['nombre' => 'Vidrio', 'descripcion' => 'Botellas y frascos de vidrio.'],
            ['nombre' => 'Metal', 'descripcion' => 'Latas, chatarra, y materiales metálicos.'],
            ['nombre' => 'Electrónico', 'descripcion' => 'Equipos electrónicos reciclables.'],
            ['nombre' => 'Orgánico', 'descripcion' => 'Residuos biodegradables.'],
        ]);
    }
}
