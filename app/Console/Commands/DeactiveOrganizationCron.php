<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Console\Command;
use App\Notifications\OrganizationDueDate;
use App\Notifications\OrganizationInvoicePaid;

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
            $diff = $formatedMonths->diffInDays($now);

            \Log::info('Dif '. round($diff));


            if (round($diff) == 60) {
                $organization->update([
                    'status' => 'deactive',
                ]);
            }

            if ($diff == -1) {
                // Buat email notification
                $admin = $organization->users()->wherePivot('role','admin')->first();

                $admin->notify(new OrganizationDueDate($organization, $admin['name']));

            }
        }

    }
}
