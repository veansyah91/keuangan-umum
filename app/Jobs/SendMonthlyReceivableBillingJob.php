<?php

namespace App\Jobs;

use App\Models\Contact;
use App\Models\WhatsappLog;
use App\Helpers\PhoneNumber;
use Illuminate\Bus\Queueable;
use App\Models\WhatsappPlugin;
use App\Jobs\SendWhatsAppNotifJob;
use Illuminate\Queue\SerializesModels;
use App\Models\StudentMonthlyReceivable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Models\StudentMonthlyReceivableLedger;

class SendMonthlyReceivableBillingJob implements ShouldQueue
{
	use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

	public $organization;
	/**
	 * Create a new job instance.
	 */
	public function __construct($organization)
	{
			$this->organization = $organization;
	}

	/**
	 * Execute the job.
	 */
	public function handle(): void
	{
		$receivables = StudentMonthlyReceivable::where('organization_id', $this->organization->id)->get();

		foreach ($receivables as $receivable) {
			if ($receivable['value'] > 0) {
				$contact = Contact::with(['student', 'lastLevel'])->find($receivable['contact_id']);

				if ($contact['phone']) {
					$whatsAppLog = WhatsappLog::create([
						'organization_id' => $this->organization->id,
						'contact_id' => $receivable['contact_id'],
						'description' => 'PENAGIHAN PIUTANG IURAN BULANAN SISWA',
						'status' => 'waiting'
					]);
	
					$whatsappPlugin = WhatsappPlugin::where('organization_id', $this->organization->id)->first();
					$tempDetail = "\nDetail:";

					$details = StudentMonthlyReceivableLedger::where('receivable_id', $receivable['id'])
																									->whereNull('paid_date')
																									->with('receivable')
																									->orderBy('study_year', 'desc')
																									->orderBy('month', 'desc')
																									->get();

					foreach ($details as $key => $detail) {
						$tempDetail .= "\nNo Ref: " . $detail['no_ref'] . "\nBulan: " . $detail['month'] . "\nTahun Ajaran: " . $detail['study_year'] . "\nJumlah: IDR. " . number_format($detail['debit'], 0, '', '.') . "\n";
					}
	
					$message = "*TAGIHAN IURAN BULANAN*\n-------------------------------------------------------\nNama: " . $contact['name'] .
					"\nNo. Siswa: " . $contact->student->no_ref .
					"\nTahun Masuk: " . $contact->student->entry_year .
					"\nKelas Sekarang: " . $contact->lastLevel->level . "\n" . $tempDetail .
					"\n\nTTD,\n\n" . strtoupper($this->organization->name);
	
					$data = array(
						'appkey' => $whatsappPlugin['appKey'],
						'authkey' => $whatsappPlugin['authkey'],
						'to' => PhoneNumber::setFormat($contact['phone']),
						'message' => $message,
						'sandbox' => 'false'
					);

					SendWhatsAppNotifJob::dispatch($data, $whatsAppLog['id'])->onQueue('whatsapp')->delay(now()->addSeconds(rand(100, 999)));

       	 	\Log::channel('whatsapp')->info($data);

				}
			}           
		}
	}
}
