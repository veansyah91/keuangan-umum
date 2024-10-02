<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use App\Models\StudentMonthlyPayment;

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
		$payments = StudentMonthlyPayment::where('type', 'prepaid')
																			->where('month', $now->month)
																			->where('study_year', $this->studyYear($now))
																			->get();

		foreach ($payments as $payment) {
			$data = [
				
			];
		}
		\Log::info($payments);

	}
}
