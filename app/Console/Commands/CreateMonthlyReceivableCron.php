<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use App\Helpers\NewRef;
use App\Models\Account;
use App\Models\Contact;
use App\Models\Organization;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\SchoolAccountSetting;
use App\Models\StudentMonthlyPayment;
use App\Models\StudentMonthlyReceivable;
use App\Models\StudentMonthlyReceivableLedger;
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
		\Log::info('Cron job penghitungan piutang spp dijalankan '.date('Y-m-d H:i:s'));
		$now = Carbon::now();
		// $usingDate = $now->subDays(1);

		$studyYear = $this->studyYear($now);

		$students = Contact::whereHas('organization', function ($query){
													return $query->where('status','<>','deactive');
												})
												->whereHas('student')
												->whereHas('studentMonthlyPayment')
												->with('lastStudentMonthlyPayment', function ($query){
													return $query->with('details');
												})
												->whereIsActive(true)
												->get();
												
		$journalRepository = new JournalRepository;
		
		foreach ($students as $student) {
			$lastPayment = $student['lastStudentMonthlyPayment'];
			if (($lastPayment['month'] !== ($now->month)) || ($lastPayment['study_year'] !== $studyYear)) {
				DB::transaction(function () use ($lastPayment, $now, $studyYear, $student, $journalRepository) {
					$accounts = SchoolAccountSetting::where('organization_id', $student['organization_id'])->first();
					$paymentAccount = Account::find($accounts['revenue_student']);
					$receivableAccount = Account::find($accounts['receivable_monthly_student']);
					$dataPayment = [
						'organization_id' => $student['organization_id'],
						'contact_id' => $student['id'],
						'no_ref' => $this->newRef($student['organization_id'], $now->subDays(1)),
						'value' => $lastPayment['value'],
						'type' => 'receivable',
						'month' => $now->month,
						'study_year' => $studyYear,
						'date' => $now->isoFormat('YYYY/MM/DD'),
						'description' => "Piutang SPP Siswa: " . $student['name'] . ' Bulan : ' . $now->month - 1 . ", Tahun Ajaran: " . $studyYear,
						'created_by_id' => $lastPayment['contact_id'],
						'accounts' => [
							// debit
							[
								'id' => $receivableAccount['id'],
								'name' => $receivableAccount['name'],
								'code' => $receivableAccount['code'],
								'is_cash' => 0,
								'debit' => $lastPayment['value'],
								'credit' => 0,
							],
							// credit
							[
								'id' => $paymentAccount['id'],
								'name' => $paymentAccount['name'],
								'code' => $paymentAccount['code'],
								'is_cash' => 0,
								'debit' => 0,
								'credit' => $lastPayment['value'],
							]
						]
					];

					// journal
					$journal = $journalRepository->store($dataPayment);

					$dataPayment['journal_id'] = $journal['id'];

					$payment = StudentMonthlyPayment::create($dataPayment);

					// masukkan detail
					foreach ($lastPayment['details'] as $detail) {
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

					// jika sudah ada piutang, maka perbarui nilai piutang
					if ($studentReceivable) {
						$temp = $studentReceivable['value'] + $lastPayment['value'];
						$studentReceivable->update([
							'value' => $temp
						]);
					} 
					// jika belum ada, maka buat data baru
					else {
						$studentReceivable = StudentMonthlyReceivable::create($dataPayment);
					}

					// detail piutang
					StudentMonthlyReceivableLedger::create([
						'receivable_id' => $studentReceivable['id'],
						'debit' => $dataPayment['value'],
						'credit' => 0,
						'date' => $dataPayment['date'],
						'description' => $dataPayment['description'],
						'no_ref' => $dataPayment['no_ref'],
						'month' => $dataPayment['month'],
						'study_year' => $dataPayment['study_year'],
						'journal_id' => $dataPayment['journal_id'],
						'created_by_id' => $dataPayment['created_by_id'],
						'payment_id' => $payment['id'],
					]);
				});
			}
		}
	}
}
