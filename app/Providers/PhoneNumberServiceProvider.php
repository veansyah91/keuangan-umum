<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class PhoneNumberServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        require_once app_path().'/Helpers/PhoneNumber.php';
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
