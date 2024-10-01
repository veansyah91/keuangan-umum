<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use App\Helpers\NewRef;
use App\Models\Contact;
use App\Models\Organization;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\StudentMonthlyPayment;
use App\Models\StudentMonthlyReceivable;
use App\Repositories\Journal\JournalRepository;

class CreateMonthlyReceivableCron extends Command
{
	/**
	 * The name and signature of the console command.
	 *
	 * @var string
	 */
	protected $signature = 'createMonthlyReceivable:cron';

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
		$refHeader = 'IB-'.$now->isoFormat('YYYY').$now->isoFormat('MM');
		$newRef = $refHeader.'0001';

		

		$payment = StudentMonthlyPayment::whereOrganizationId($organization)
				->where('no_ref', 'like', $refHeader.'%')
				->orderBy('no_ref','desc')
				->first();

		if ($payment) {
			$newRef = NewRef::create('IB-', $payment['no_ref']);
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
		// \Log::info('Cron job pencatatan piutang spp dijalankan '.date('Y-m-d H:i:s'));
		$now = Carbon::now();
		$usingDate = $now->subDays(1);

		$studyYear = $this->studyYear($now);

		$students = Contact::whereHas('organization', function ($query){
													return $query->where('status','<>','deactive');
												})
												->whereHas('student')
												->whereHas('studentMonthlyPayment')
												->whereIsActive(true)
												->get();
												
		$journalRepository = new JournalRepository;

		// \Log::info('Tanggal Sebelum: '. $usingDate->isoFormat('YYYY/MM/DD'));
		// return ;
		foreach ($students as $student) {
			// cek apakah telah terjadi pembayaran pada bulan yag dibutuhkan
			$payment = StudentMonthlyPayment::where('contact_id', $student['id'])
																				->where('month', $now->month - 1)
																				->where('study_year', $studyYear)
																				->first();
																				
			if (!$payment) {
				// cek histori pembayaran sebelumnya sebagai acuan utk membuat data baru
				$historyPayment = StudentMonthlyPayment::where('contact_id', $student['id'])
																									->with('details')
																									->latest('id')->first();

				DB::transaction(function () use ($historyPayment, $now, $studyYear, $student, $usingDate, $journalRepository) {
					$dataPayment = [
						'organization_id' => $student['organization_id'],
						'contact_id' => $student['id'],
						'no_ref' => $this->newRef($student['organization_id'], $now->subDays(1)),
						'value' => $historyPayment['value'],
						'type' => 'receivable',
						'month' => $now->month - 1,
						'study_year' => $studyYear,
						'date' => $usingDate->isoFormat('YYYY/MM/DD'),
						'description' => "Piutang SPP Siswa: " . $student['name'] . 'Bulan : ' . $now->month - 1 . "Tahun Ajaran: " . $studyYear,
						'user_id' => $payment['contact_id']
					];

					// journal
					$journalRepository->store($journalData);

					$payment = StudentMonthlyPayment::create($dataPayment);

					// masukkan detail
					foreach ($historyPayment['details'] as $detail) {
						$data = [
							'payment_id' => $payment['id'],
							'student_payment_category_id' => $detail['id'],
							'value' => $detail['pivot']['value'],
						];
	
						DB::table('s_monthly_payment_details')
							->insert($data);						
					}					

					// cek table piutang
					$studentReceivable = StudentMonthlyReceivable::whereContactId($student['id'])
																												->first();

					if ($studentReceivable) {
						# code...
					}

					// jika sudah ada piutang, maka perbarui nilai piutang

					// jika belum ada, maka buat data baru
				});
				
				
			}
			

			
		}


	}
}
