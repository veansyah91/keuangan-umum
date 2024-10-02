<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        Commands\DepreciationCron::class,
    ];

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('depreciation:cron')
            ->daily();
            // ->everyMinute();
        $schedule->command('deactiveOrganization:cron')
            ->daily();
        // ->everyMinute();
        $schedule->command('organizationInvoice:cron')
            ->daily();
        // ->everyMinute();
        $schedule->command('createMonthlyReceivable:cron')
            ->timezone('Asia/Jakarta')
            ->monthlyOn(1, '00:00');
        // ->everyMinute();
        $schedule->command('monthlyPaymentPrepaid:cron')
            // ->timezone('Asia/Jakarta')
            // ->monthlyOn(1, '00:00');
        ->everyMinute();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
