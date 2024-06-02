<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class DeactiveOrganizationCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'deactiveOrganization:cron';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Sample
        \Log::info("Cron job Deactive Organization di jalankan " . date('Y-m-d H:i:s'));
    }
}
