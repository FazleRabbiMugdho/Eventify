<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // This tells Laravel to include migrations from your root database folder
        // '../database' moves from the server folder back to the Eventify root,
        // then enters the database/migrations folder.
        if ($this->app->runningInConsole()) {
            $this->loadMigrationsFrom(base_path('../database/migrations'));
        }
    }
}