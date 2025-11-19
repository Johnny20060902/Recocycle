<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Usuario;

class RecalcularReputacion extends Command
{
    /**
     * El nombre y firma del comando Artisan.
     *
     * Se ejecuta con: php artisan reputacion:recalcular
     */
    protected $signature = 'reputacion:recalcular {--role=}';

    /**
     * Descripción del comando
     */
    protected $description = 'Recalcula el promedio de reputación (rating_promedio) de todos los usuarios o por rol.';

    /**
     * Ejecuta el comando.
     */
    public function handle(): int
    {
        $role = $this->option('role');

        $query = Usuario::query();

        if ($role) {
            $query->where('role', $role);
            $this->info("🔹 Filtrando por rol: {$role}");
        }

        $total = $query->count();

        if ($total === 0) {
            $this->warn('⚠️ No se encontraron usuarios para recalcular.');
            return Command::SUCCESS;
        }

        $this->info("♻️ Recalculando reputación para {$total} usuarios...\n");

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $actualizados = 0;

        $query->chunk(100, function ($usuarios) use (&$actualizados, $bar) {
            foreach ($usuarios as $usuario) {
                $nuevoPromedio = $usuario->calificacionesRecibidas()->avg('puntaje') ?? 0;
                $usuario->update(['rating_promedio' => round($nuevoPromedio, 2)]);
                $actualizados++;
                $bar->advance();
            }
        });

        $bar->finish();

        $this->newLine(2);
        $this->info("✅ Reputación recalculada correctamente para {$actualizados} usuarios.");
        $this->line("💡 Fecha de ejecución: " . now()->format('d/m/Y H:i:s'));

        return Command::SUCCESS;
    }
}
