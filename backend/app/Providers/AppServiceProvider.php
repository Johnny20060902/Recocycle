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
     * Register any application services.
     */
    public function register(): void
    {
        // Aquí no va nada por ahora
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 🔥 Prefetch de Vite (optimización)
        Vite::prefetch(concurrency: 3);

        // 🌐 Forzar HTTPS y URL correcta en Render
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
            URL::forceRootUrl(config('app.url'));
        }

        // ✉️ Registrar el transport personalizado de Gmail API
        Mail::extend('gmail', function () {
            return new GmailTransport();
        });
    }
}
