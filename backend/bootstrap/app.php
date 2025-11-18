<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// 🔥 Middleware necesarios
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Middleware\TrustProxies;

return Application::configure(basePath: dirname(__DIR__))

    /*
    |--------------------------------------------------------------------------
    | RUTEO (web, consola y health-check)
    |--------------------------------------------------------------------------
    */
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )

    /*
    |--------------------------------------------------------------------------
    | MIDDLEWARE (Laravel 12 ya no tiene Kernel)
    |--------------------------------------------------------------------------
    */
    ->withMiddleware(function (Middleware $middleware) {

        // 🔥 TRUST PROXIES → Necesario en Render (HTTPS + Reverse Proxy)
        $middleware->append(TrustProxies::class);

        // 🔥 Web Middleware: Inertia + Preload de assets
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // 🔥 Alias de middleware personalizados
        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);
    })

    /*
    |--------------------------------------------------------------------------
    | EXCEPCIONES
    |--------------------------------------------------------------------------
    */
    ->withExceptions(function (Exceptions $exceptions) {
        // Aquí podés personalizar reporting o handlers si querés
    })

    ->create();
