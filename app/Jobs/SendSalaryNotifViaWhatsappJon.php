<?php

namespace App\Jobs;

use Carbon\Carbon;
use App\Models\Contact;
use App\Models\WhatsappLog;
use App\Helpers\PhoneNumber;
use Illuminate\Bus\Queueable;
use App\Models\WhatsappPlugin;
use App\Jobs\SendWhatsAppNotifJob;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendSalaryNotifViaWhatsappJon implements ShouldQueue
{
	use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

	public $organization, $payment;
	/**
	 * Create a new job instance.
	 */
	public function __construct($organization, $payment)
	{
		$this->organization = $organization;
		$this->payment = $payment;
	}

	public function handle(): void
	{
		$temp_payment = $this->payment;
		$payments = Contact::whereHas('staff')
												->whereHas('staffSalaryPayment', function ($query) use ($temp_payment){
													return $query->where('payment_id', $temp_payment['id']);
												})
												->with([
													'staff',
													'staffSalaryPayment' => function ($query) use ($temp_payment) {
														return $query->where('payment_id', $temp_payment['id'])->with('category');
													}
												])
												->where('organization_id', $this->organization['id'])
												->whereNotNull('phone')
												->orderBy('name')
												->get();

		$whatsappPlugin = WhatsappPlugin::where('organization_id', $this->organization->id)->first();

		$delay = 0;

		foreach ($payments as $payment) {
			$whatsAppLog = WhatsappLog::create([
				'organization_id' => $this->organization->id,
				'contact_id' => $payment['id'],
				'description' => 'PEMBAYARAN GAJI STAF',
				'status' => 'waiting'
			]);

			$tempDetail = "";
			$total = 0;

			// detail plus
			$key = 1;
			foreach ($payment['staffSalaryPayment'] as $detail) {
				if ($detail->value > 0) {
					$total += $detail->value;
					$unit = $detail->category->unit ? $detail->qty . " " . $detail->category->unit . " x IDR. " . number_format($detail->value, 0, '', '.') . " = " : "";

					$tempDetail .= "\n" . $key++ . "." . $detail->category->name . ": " . $unit . number_format($detail->value, 0, '', '.');	
				}
			}

			// detail plus
			$key = 1;
			foreach ($payment['staffSalaryPayment'] as $detail) {
				if ($detail->value < 0) {
					if ($key < 2) {
						$tempDetail .= "\n*Potongan*";						
					}
					$total += $detail->value;
					$unit = $detail->category->unit ? $detail->qty . " " . $detail->category->unit . " x IDR. " . number_format($detail->value, 0, '', '.') . " = " : "";

					$tempDetail .= "\n" . $key++ . "." . $detail->category->name . ": " . $unit . number_format($detail->value, 0, '', '.');					
				}
			}

			$tempDetail .= "\nTotal: IDR. " . number_format($total, 0, '', '.');

			$tempDate = new Carbon($payment['date']);

			$message = "*TANDA TERIMA GAJI BULANAN*\n-------------------------------------------------------\nNama: " . $payment['name'] .
			"\nNo. Staf: " . $payment->staff->no_ref . 
			"\nJabatan: " . $payment->staff->position . 
			"\nTahun Masuk: " . $payment->staff->entry_year . 
			"\n-------------------------------------------------------\nHari/Tanggal: " . $tempDate->isoFormat('D MMMM YYYY') .
			"\nBulan: " . $temp_payment['month'] . "(" . $temp_payment['study_year'] .")" .
			"\nTotal: IDR. " . number_format($total, 0, '', '.') .
			"\n\nDETAIL:" . $tempDetail . "\n\nTTD,\n\n" . strtoupper($this->organization['name'])
			;

			$delay += rand(3, 5);
			$data = array(
				'appkey' => $whatsappPlugin['appKey'],
				'authkey' => $whatsappPlugin['authkey'],
				'to' => PhoneNumber::setFormat($payment['phone']),
				'target' => PhoneNumber::setFormat($payment['phone']),
				'message' => $message,
				'sandbox' => 'false'
			);

			\Log::channel('whatsapp')->info($message);
			SendWhatsAppNotifJob::dispatch($data, $whatsAppLog['id'])->onQueue('whatsapp')->delay(now()->addSeconds(rand(100, 200)));

		}
												
	}
}
