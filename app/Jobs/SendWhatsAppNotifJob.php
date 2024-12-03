<?php

namespace App\Jobs;

use App\Models\WhatsappLog;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use App\Repositories\WhatsApp\WhatsAppRepository;

class SendWhatsAppNotifJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $data, $id;

    /**
     * Create a new job instance.
     */
    public function __construct($data, $id)
    {
        $this->data = $data;
        $this->id = $id;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $whatsAppRepository = new WhatsAppRepository;
        
        $whatsAppLog = WhatsappLog::find($this->id);

        $result = $whatsAppRepository->sendMessage($this->data);
        $result_object = json_decode($result);

        try {
            if ($result_object->message_status === "Success") {
                $whatsAppLog->update([
                    'status' => 'sent'
                ]);
            }            
        } catch (\Throwable $th) {
            $whatsAppLog->update([
                'status' => 'failed'
            ]);
        }
    }
}
