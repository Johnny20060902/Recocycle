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
        // Registrar el mailer personalizado "gmail"
        Mail::extend('gmail', function () {
            return new GmailTransport();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Optimización Vite
        Vite::prefetch(concurrency: 3);

        // Forzar HTTPS en producción (Render)
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
            URL::forceRootUrl(config('app.url'));
        }
    }
}
