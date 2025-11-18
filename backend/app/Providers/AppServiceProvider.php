<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 🔥 Prefetch de Vite (optimización de front)
        Vite::prefetch(concurrency: 3);

        // 🔥 FORZAR HTTPS EN PRODUCCIÓN
        // Esto evita Mixed Content y obliga a axios/inertia a usar https
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }
    }
}
