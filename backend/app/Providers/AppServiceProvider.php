<?php

namespace App\Providers;

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
        \App\Models\Recurso::observe(\App\Observers\AuditObserver::class);
        \App\Models\Reserva::observe(\App\Observers\AuditObserver::class);
    }
}
