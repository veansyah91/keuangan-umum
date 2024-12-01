<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use App\Helpers\NewRef;
use App\Models\Account;
use App\Models\Journal;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\SchoolAccountSetting;
use App\Models\StudentMonthlyPayment;
use App\Repositories\Journal\JournalRepository;

class MonthlyPaymentPrepaidCron extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'monthlyPaymentPrepaid:cron';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Command description';

	/**
	 * Execute the console command.
	 */

	protected function newRef($organization, $now)
	{
		$refHeader = 'BD-'.$now->isoFormat('YYYY').$now->isoFormat('MM');
		$newRef = $refHeader.'0001';		

		$payment = Journal::whereOrganizationId($organization)
																		->where('no_ref', 'like', $refHeader.'%')
																		->orderBy('no_ref','desc')
																		->first();

		if ($payment) {
			$newRef = NewRef::create('BD-', $payment['no_ref']);
		}

		return $newRef;
	}

	protected function studyYear($date)
	{
		if ($date->month > 6) {
			return (string)$date->year . "/" . (string)$date->year + 1;
		} else {
			return (string)$date->year - 1 . "/" . (string)$date->year;
		}
	}

	public function handle()
	{
		// \Log::info('Cron job pembaruan spp dibayar dimuka dijalankan '.date('Y-m-d H:i:s'));
		$now = Carbon::now();
			
		// cek pembayaran yang dibayar di muka
		$payments = StudentMonthlyPayment::whereHas('organization', function ($query){
																					return $query->where('status','<>','deactive');
																				})
																			->where('type', 'prepaid')
																			->where('month', $now->month)
																			->where('study_year', $this->studyYear($now))
																			->with('contact')
																			->get();

		$journalRepository = new JournalRepository;
		
		foreach ($payments as $payment) {
			$schoolAccount = SchoolAccountSetting::whereOrganizationId($payment['organization_id'])->first();
			$prepaidAccount = Account::find($schoolAccount['prepaid_student']);
			$paymentAccount = Account::find($schoolAccount['revenue_student']);
			$data = [
				'accounts' => [
					// debit
					[
						'id' => $prepaidAccount['id'],
						'name' => $prepaidAccount['name'],
						'code' => $prepaidAccount['code'],
						'is_cash' => 0,
						'debit' => $payment['value'],
						'credit' => 0,
					],
					// credit
					[
						'id' => $paymentAccount['id'],
						'name' => $paymentAccount['name'],
						'code' => $paymentAccount['code'],
						'is_cash' => 0,
						'debit' => 0,
						'credit' => $payment['value'],
					]
				],
				'no_ref' => $this->newRef($payment['organization_id'], $now),
				'description' => 'Pendapatan dari Iuran Bayar Di Muka oleh : ' . $payment['contact']['name'] . ', Bulan: ' . $payment['month'] . ', Tahun Ajaran: ' . $payment['study_payment'],
				'date' => $now->isoFormat('YYYY/MM/DD'),
				'value' => $payment['value'],
				'organization_id' => $payment['organization_id'],
				'contact_id' => $payment['contact_id'],
				'created_by_id' => $payment['contact_id'],
			];
			
			DB::transaction(function() use ($data, $payment, $journalRepository) {
				// journal
				$journal = $journalRepository->store($data);

				$data['journal_id'] = $journal['id'];

				$payment->update([
					'prepaid_journal_id' => $journal['id'],
					'type' => 'now'
				]);
			});
		}
	}
}
