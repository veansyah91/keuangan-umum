<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;
use App\Models\OrganizationInvoice;

class OrganizationInvoiceCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'organizationInvoice:cron';

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
        \Log::info('Cron job Organization Invoice dijalankan '.date('Y-m-d H:i:s'));

        $now = CarbonImmutable::now();
        $organizations = OrganizationInvoice::where('status', 'pending')->get();

        foreach ($organizations as $organization) {
            $formatedMonths = Carbon::parse($organization['created_at']->toDateString());

            $diff = $formatedMonths->diffInDays($now);

            if ($diff > 1) {
                $organization->update([
                    'status' => 'canceled',
                ]);
            }
        }
    }
}
