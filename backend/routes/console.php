<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

use Illuminate\Support\Facades\Schedule;

// 🕒 Ejecutar el recalculo de reputación cada lunes a las 03:00 AM
Schedule::command('reputacion:recalcular')
    ->weeklyOn(1, '03:00')
    ->sendOutputTo(storage_path('logs/reputacion.log'));
