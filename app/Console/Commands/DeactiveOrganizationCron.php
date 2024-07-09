<?php

namespace App\Console\Commands;

use App\Models\Organization;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
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
        \Log::info('Cron job Deactive Organization dijalankan '.date('Y-m-d H:i:s'));

        $now = CarbonImmutable::now();
        $organizations = Organization::where('status', '<>', 'deactive')->get();

        foreach ($organizations as $organization) {
            $formatedMonths = Carbon::parse($organization['expired']);
            $diff = $formatedMonths->diffInMonths($now);

            if ($diff > 2) {
                \Log::info($diff);
                $organization->update([
                    'status' => 'deactive',
                ]);
                // \Log::info($organization);

            }

        }

        // \Log::info($organizations);

    }
}
