<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Repositories\WhatsApp\WhatsAppRepository;

class WhatsappAddonsInvoiceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $message, $phone, $whatsAppRepository;

    /**
     * Create a new job instance.
     */
    public function __construct(WhatsAppRepository $whatsAppRepository, $message, $phone)
    {
        $this->message = $message;
        $this->phone = $phone;
        $this->whatsAppRepository = $whatsAppRepository;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->whatsAppRepository->sendOrganizationInvoice("6281276811842", "Pesan dari Keuangan Umum\n\nHormat Kami");
    }
}
