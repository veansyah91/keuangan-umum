<?php

namespace App\Jobs;

use App\Models\Contact;
use App\Models\WhatsappLog;
use App\Helpers\PhoneNumber;
use Illuminate\Bus\Queueable;
use App\Models\WhatsappPlugin;
use App\Jobs\SendWhatsAppNotifJob;
use App\Models\StudentEntryPayment;
use App\Models\StudentEntryReceivable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendYearlyReceivableBillingJob implements ShouldQueue
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
		$receivables = StudentEntryReceivable::whereOrganizationId($this->organization->id)
																				->where('value', '>', 0)
																				->get();

		$whatsappPlugin = WhatsappPlugin::where('organization_id', $this->organization->id)->first();

		$delay = 0;
		
		foreach ($receivables as $receivable) {
			$contact = Contact::with(['student', 'lastLevel'])->find($receivable['contact_id']);

			if ($contact['phone']) {
				$whatsAppLog = WhatsappLog::create([
					'organization_id' => $this->organization->id,
					'contact_id' => $contact['id'],
					'description' => 'TAGIHAN IURAN TAHUNAN SISWA',
					'status' => 'waiting'
				]);
	
				$details = StudentEntryPayment::whereOrganizationId($this->organization->id)
														->where('contact_id', $contact['id'])
														->where('receivable_value', '>', 0)
														->with('receivables', function ($query) {
															return $query->where('credit', '>', 0);
														})
														->orderBy('study_year', 'desc')
														->orderBy('date', 'desc')
														->orderBy('no_ref', 'desc')
														->get();
	
				$tempDetail = '';
				foreach ($details as $key => $detail) {
					if ($detail['value'] > 0) {
						$tempDetail .= "\n" . ($key + 1) . ". " . $detail['no_ref'] . ": IDR. " . number_format($detail['receivable_value'], 0, '', '.');
					}
				}
	
				$tempDetail .= "\nTotal: IDR. " . number_format($receivable['value'], 0, '', '.');
	
				$message = "*TAGIHAN IURAN TAHUNAN*\n-------------------------------------------------------\nNama : " . $contact['name'] . "\nNo. Siswa : " . $contact->student->no_ref . "\nTahun Masuk : " . $contact->student->entry_year . "\nKelas Sekarang : " . $contact->lastLevel->level . "\n\nDETAIL:" . $tempDetail . "\n\nTTD,\n\n" . strtoupper($this->organization['name']);
				// $data = array(
				// 	'appkey' => $whatsappPlugin['appKey'],
				// 	'authkey' => $whatsappPlugin['authkey'],
				// 	'to' => PhoneNumber::setFormat($contact['phone']),
				// 	'message' => $message,
				// 	'sandbox' => 'false'
				// );

				$data = array(
					'appkey' => $whatsappPlugin['appKey'],
					'authkey' => $whatsappPlugin['authkey'],
					'target' => PhoneNumber::setFormat($contact['phone']),
					'message' => $message,
					'sandbox' => 'false'
				);

				$delay += rand(3, 5);
	
				SendWhatsAppNotifJob::dispatch($data, $whatsAppLog['id'])->onQueue('whatsapp')->delay($delay);
			}
		}
	}
}
