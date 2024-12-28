<?php

namespace App\Console\Commands;

use App\Helpers\NewRef;
use App\Models\Account;
use App\Models\FixedAsset;
use App\Models\Journal;
use App\Repositories\Journal\JournalRepository;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;

class DepreciationCron extends Command
{
    protected function newRef($organization, $dateRequest = '')
    {
        $date = $dateRequest;
        $dateRef = Carbon::create($date);
        $refHeader = 'JU-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
        $newRef = $refHeader.'001';

        $journal = Journal::whereOrganizationId($organization)
            ->where('no_ref', 'like', $refHeader.'%')
            ->orderBy('no_ref')
            ->get()
            ->last();

        if ($journal) {
            $newRef = NewRef::create('JU-', $journal['no_ref']);
        }

        return $newRef;
    }

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
            \Log::info('Cron job Depreciation Berhasil di jalankan '.date('Y-m-d H:i:s'));
            $fixedAssets = FixedAsset::where('is_disposed', false)
                ->whereColumn('value', '<>', 'depreciation_accumulated')
                ->get();

            $now = CarbonImmutable::now();

            $journalRepository = new JournalRepository;

            foreach ($fixedAssets as $fixedAsset) {
                // bandingkan waktu sekarang dan bulan (tanggal) aset diadakan
                $formatedMonths = Carbon::parse($fixedAsset['date']);

                $diff = $formatedMonths->diffInMonths($now);
                $diffDepreciation = ($diff * $fixedAsset['depreciation_value']) - $fixedAsset['depreciation_accumulated'];

                // bandingkan nilai akumulasi sekarang dan akumulasi seharusnya
                if ($diffDepreciation > $fixedAsset['residu']) {
                    $depreciationValue = $fixedAsset['depreciation_value'];

                    if ($diffDepreciation < $depreciationValue) {
                        $depreciationValue = $diffDepreciation;
                    }

                    $fixedAsset->update([
                        'depreciation_accumulated' => $fixedAsset['depreciation_accumulated'] + $depreciationValue,
                    ]);

                    //acccounts
                    //depreciation accumulation
                    $dep_acc = Account::find($fixedAsset['accumulated_depreciation']);

                    //depreciation cost
                    $dep_cost = Account::find($fixedAsset['depreciation']);

                    // journal
                    $validated['no_ref'] = $this->newRef($fixedAsset['organization_id'], $now->isoFormat('YYYY-MM-DD'));
                    $validated['description'] = 'Penyusutan Harta Tetap '.$fixedAsset['name'];
                    $validated['date'] = $now->isoFormat('YYYY-MM-DD');
                    $validated['value'] = $depreciationValue;
                    $validated['organization_id'] = $fixedAsset['organization_id'];
                    $validated['accounts'] = [
                        [
                            'id' => $dep_acc['id'],
                            'code' => $dep_acc['code'],
                            'debit' => 0,
                            'credit' => $depreciationValue,
                            'is_cash' => $dep_acc['is_cash'],
                        ],
                        [
                            'id' => $dep_cost['id'],
                            'code' => $dep_cost['code'],
                            'debit' => $depreciationValue,
                            'credit' => 0,
                            'is_cash' => $dep_cost['is_cash'],
                        ],
                    ];

                    $journalRepository->store($validated);
                }

            }

            // \Log::info($fixedAssets);

        } catch (\Throwable $th) {
            //throw $th;
            \Log::info($th);
        }

    }
}
