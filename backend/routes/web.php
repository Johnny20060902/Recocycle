<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Controladores principales
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CalificacionController;
use App\Http\Controllers\RecolectorController;


// Panel Admin
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\EmpresaController;
use App\Http\Controllers\Admin\PremioController as AdminPremioController;
use App\Http\Controllers\Admin\RankingController as AdminRankingController;
use App\Http\Controllers\Admin\UsuarioController as AdminUsuarioController;
use App\Http\Controllers\Admin\RecolectorController as AdminRecolectorController;
use App\Http\Controllers\Admin\CategoriaController;
use App\Http\Controllers\Admin\ReporteController;


// Panel Usuario
use App\Http\Controllers\Usuario\UsuarioController;
use App\Http\Controllers\Usuario\PremioController as UsuarioPremioController;
use App\Http\Controllers\Usuario\ReciclajeController as UsuarioReciclajeController;
use App\Http\Controllers\Usuario\RankingController as UsuarioRankingController;





// Flujo Recolector
use App\Http\Controllers\Recolector\FlujoRecoleccionController;
use App\Http\Controllers\Recolector\DashboardController;
use App\Http\Controllers\Recolector\RankingController as RecolectorRankingController;

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
})->name('home');

/*
|--------------------------------------------------------------------------
| LOGIN POR ROL
|--------------------------------------------------------------------------
*/
Route::get('/admin/login', fn() => Inertia::render('Auth/Login', ['role' => 'admin']))->name('admin.login');
Route::get('/recolector/login', fn() => Inertia::render('Auth/Login', ['role' => 'recolector']))->name('recolector.login');
Route::get('/usuario/login', fn() => Inertia::render('Auth/Login', ['role' => 'usuario']))->name('usuario.login');

/*
|--------------------------------------------------------------------------
| RUTAS AUTENTICADAS (TODOS LOS ROLES)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    // Redirección dinámica según rol
    Route::get('/dashboard', function () {
        $user = auth()->user();

        return match ($user->role) {
            'admin'      => to_route('admin.dashboard'),
            'recolector' => to_route('recolector.dashboard'),
            default      => to_route('usuario.dashboard'),
        };
    })->name('dashboard');

    // Perfil de usuario
    Route::get('/profile',  [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile',[ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile',[ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| PANEL ADMINISTRADOR
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->as('admin.')
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])
            ->name('dashboard');

        // Usuarios y Recolectores
        Route::resource('recolectores', AdminRecolectorController::class)
            ->parameters(['recolectores' => 'recolector']);

        Route::resource('usuarios', AdminUsuarioController::class);

        // Categorías de Reciclaje
        Route::resource('categorias', CategoriaController::class)
            ->except(['show']);

        // Reportes
        Route::get('/reportes', [ReporteController::class, 'index'])->name('reportes.index');
        Route::get('/reportes/recolectores/pdf', [ReporteController::class, 'recolectoresReporte'])->name('reportes.recolectores.pdf');
        Route::get('/reportes/recolectores/descargar', [ReporteController::class, 'recolectoresDescargar'])->name('reportes.recolectores.descargar');
        Route::get('/reportes/usuarios/pdf', [ReporteController::class, 'usuariosReporte'])->name('reportes.usuarios.pdf');
        Route::get('/reportes/usuarios/descargar', [ReporteController::class, 'usuariosDescargar'])->name('reportes.usuarios.descargar');

        // Empresas
        Route::resource('empresas', EmpresaController::class);

        // Calificaciones
        Route::get('/calificaciones', [CalificacionController::class, 'index'])->name('calificaciones.index');

        // Ranking
        Route::get('/ranking', [AdminRankingController::class, 'index'])->name('ranking.index');
        Route::post('/ranking/{usuario}/puntaje', [AdminRankingController::class, 'actualizarPuntaje'])->name('ranking.puntaje');
        Route::post('/ranking/puntaje-masivo', [AdminRankingController::class, 'actualizarPuntajeMasivo'])->name('ranking.puntajeMasivo');

        // Premios
        Route::resource('premios', AdminPremioController::class)
            ->only(['index', 'create', 'store']);
    });

/*
|--------------------------------------------------------------------------
| PANEL USUARIO
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:usuario'])
    ->prefix('usuario')
    ->as('usuario.')
    ->group(function () {

        Route::get('/dashboard', [UsuarioController::class, 'dashboard'])->name('dashboard');

        // Reciclaje
        Route::get('/reciclajes', [UsuarioReciclajeController::class, 'index'])->name('reciclajes.index');
        Route::get('/reciclar', [UsuarioReciclajeController::class, 'create'])->name('reciclar');
        Route::post('/reciclar', [UsuarioReciclajeController::class, 'store'])->name('reciclar.store');
        Route::delete('/reciclajes/{punto}', [UsuarioReciclajeController::class, 'destroy'])->name('reciclajes.destroy');
        Route::get('/puntos/list', [UsuarioReciclajeController::class, 'list'])->name('puntos.list');


        // Puntos
        Route::get('/puntos', [UsuarioController::class, 'puntos'])->name('puntos');

        // Premios
        Route::get('/premios', [UsuarioPremioController::class, 'index'])->name('premios');

        // Ranking
        Route::get('/ranking', fn() => Inertia::render('Usuario/Ranking'))->name('ranking');
        Route::get('/ranking/data', [UsuarioRankingController::class, 'data'])->name('ranking.data');

        // Calificaciones
        Route::post('/calificaciones', [CalificacionController::class, 'store'])->name('calificaciones.store');

        // Solicitudes de recolector
        Route::post('/puntos/{punto}/aceptar-solicitud', [FlujoRecoleccionController::class, 'aceptarSolicitud'])
            ->name('puntos.aceptarSolicitud');

        Route::post('/puntos/{punto}/rechazar-solicitud', [FlujoRecoleccionController::class, 'rechazarSolicitud'])
            ->name('puntos.rechazarSolicitud');
    });

/*
|--------------------------------------------------------------------------
| PANEL RECOLECTOR
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:recolector'])
    ->prefix('recolector')
    ->as('recolector.')
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/dashboard/data', [DashboardController::class, 'data'])->name('dashboard.data');

        // Mapa
        Route::get('/', [RecolectorController::class, 'index'])->name('index');
        Route::get('/mapa', [RecolectorController::class, 'mapa'])->name('mapa');

        // Puntos
        Route::get('/puntos', [RecolectorController::class, 'puntos'])->name('puntos');
        Route::get('/puntos-cercanos', [RecolectorController::class, 'puntosCercanos'])->name('puntosCercanos');

        // Historial
        Route::get('/historial', [RecolectorController::class, 'historial'])->name('historial');

        // Ranking
        Route::get('/ranking', fn() => Inertia::render('Recolector/Ranking'))->name('ranking');
        Route::get('/ranking/data', [RecolectorRankingController::class, 'data'])->name('ranking.data');

        // Flujo completo
        Route::post('/puntos/{punto}/solicitar',  [FlujoRecoleccionController::class, 'solicitar'])->name('puntos.solicitar');
        Route::post('/puntos/{punto}/en-camino', [FlujoRecoleccionController::class, 'enCamino'])->name('puntos.enCamino');
        Route::post('/puntos/{punto}/completar', [FlujoRecoleccionController::class, 'completar'])->name('puntos.completar');
        Route::post('/puntos/limpiar-pendientes', [FlujoRecoleccionController::class, 'limpiarPendientes'])->name('puntos.limpiarPendientes');

        // Calificaciones
        Route::post('/calificaciones', [CalificacionController::class, 'store'])->name('calificaciones.store');
    });

/*
|--------------------------------------------------------------------------
| CALIFICACIONES GLOBAL
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::post('/calificar', [CalificacionController::class, 'store'])->name('calificar.store');
});

/*
|--------------------------------------------------------------------------
| AUTENTICACIÓN BREEZE
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';
