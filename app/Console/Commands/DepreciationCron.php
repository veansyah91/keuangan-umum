<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use App\Models\FixedAsset;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;

class DepreciationCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'depreciation:cron';

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
        try {
            // \Log::info("Depreciation Schedule Cron job Berhasil di jalankan " . date('Y-m-d H:i:s'));
            $fixedAssets = FixedAsset::where('is_disposed', false)
                                    ->where('value', '!=', 'depreciation_accumulated')
                                    ->get();

            $now = CarbonImmutable::now();

            foreach ($fixedAssets as $fixedAsset) {
                // bandingkan waktu sekarang dan bulan (tanggal) aset diadakan
                $formatedMonths = Carbon::parse($fixedAsset['date']);

                

            }

            \Log::info($fixedAssets);

        } catch (\Throwable $th) {
            //throw $th;
            \Log::info($th . date('Y-m-d H:i:s'));
        }

    }
}
