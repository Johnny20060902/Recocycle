<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Mail;
use App\Mail\GmailTransport;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // nada aquí, o Laravel explota
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Vite optimización
        Vite::prefetch(concurrency: 3);

        // Forzar HTTPS en producción
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
            URL::forceRootUrl(config('app.url'));
        }

        // 👇 REGISTRO CORRECTO PARA LARAVEL 12
        Mail::extend('gmail', function ($config = []) {
            return new GmailTransport();
        });
    }
}
