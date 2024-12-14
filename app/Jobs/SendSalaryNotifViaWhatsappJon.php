<?php

namespace App\Jobs;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
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
														'staffSalaryPayment' => function ($query) {
															return $query->with('category');
														}
													])
												->where('organization_id', $this->organization['id'])
												->orderBy('name')
												->get();

		foreach ($payments as $payment) {
			$tempDetail = "";

			// detail plus
			foreach ($payment['staffSalaryPayment'] as $key => $detail) {
				if ($detail['value'] > 0) {
					$unit = $detail['unit'] ? $detail['qty'] . " " . $detail['unit'] . " x IDR. " . number_format($detail['value'], 0, '', '.') . " = " : "";

					$tempDetail .= "\n" . $key+1 . "." . $detail['name'] . ": " . $unit . number_format($detail['total'], 0, '', '.');	
					\Log::channel('whatsapp')->info(gettype($detail));
					// \Log::channel('whatsapp')->info($unit);

				}

			}

			// detail plus
			foreach ($payment['staffSalaryPayment'] as $key => $detail) {
				if ($detail['value'] < 0) {
					if ($key < 1) {
						$tempDetail .= "\n*Potongan*";						
					}
					$unit = $detail['unit'] ? $detail['qty'] . " " . $detail['unit'] . " x IDR. " . number_format($detail['value'], 0, '', '.') . " = " : "";

					$tempDetail .= "\n" . $key+1 . "." . $detail['name'] . ": " . $unit . number_format($detail['total'], 0, '', '.');					
				}
			}

			// \Log::channel('whatsapp')->info($tempDetail);
		}
												
	}
}
