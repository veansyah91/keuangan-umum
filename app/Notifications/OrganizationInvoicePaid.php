<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class OrganizationInvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    private $organization, $organizationInvoice, $name;
    /**
     * Create a new notification instance.
     */
    public function __construct($organization, $organizationInvoice, $name)
    {
        $this->organization = $organization;
        $this->organizationInvoice = $organizationInvoice;
        $this->name = $name;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $tempDate = new Carbon($this->organizationInvoice['created_at']);
        $tempDateUpdate = new Carbon($this->organizationInvoice['updated_at']);
        $tempDateExpired = new Carbon($this->organization['expired']);

        return (new MailMessage)
                    ->greeting('Hai ' . $this->name . ',')
                    ->line('Layanan anda telah diperpanjang, rincian sebagai berikut:')
                    ->line('Organisasi: ' . $this->organization['name'])
                    ->line('No. Ref: ' . $this->organizationInvoice['no_ref'])
                    ->line('Tanggal Pembuatan: ' . $tempDate->isoFormat('D MMMM YYYY'))
                    ->line('Tanggal Diperpanjang: ' . $tempDateUpdate->isoFormat('D MMMM YYYY'))
                    ->line('Tanggal Kadaluarsa: ' .  $tempDateExpired->isoFormat('D MMMM YYYY'))
                    ->line('Jenis Layanan : ' . $this->organizationInvoice['product'])
                    ->line('Harga : IDR. ' . number_format($this->organizationInvoice['price'], 0, '', '.'))
                    ->line('Status : TELAH DIBAYAR')
                    // ->line('Silakan Lakukan Pembayaran via Transfer Bank: ' . env('BANK') . '-' . env('BANK_ACCOUNT') . ' (an. ' . env('BANK_NAME') . ')')
                    // ->action('Konfirmasi', url('/'))
                    ->line('Terima kasih telah menggunakan Layanan Keuangan Umum.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
