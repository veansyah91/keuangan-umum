<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class OrganizationDueDate extends Notification implements ShouldQueue
{
    use Queueable;

    private $organization, $name;

    /**
     * Create a new notification instance.
     */
    public function __construct($organization, $name)
    {
        $this->organization = $organization;
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
        $tempDate = new Carbon($this->organization['expired']);

        return (new MailMessage)
            ->greeting('Hai ' . $this->name . ',')
            ->line('Layanan anda akan berakhir dalam 30 hari, silakan melakukan perpanjangan Layanan agar anda bisa terus menikmati Layanan Keuangan Umum')
            ->line('Organisasi: ' . $this->organization['name'])
            ->line('Tanggal Kadaluarsa: ' . $tempDate->isoFormat('D MMMM YYYY'))
            // ->action('Klik untuk memperpanjang Layanan', url('/organizations/' . $this->organization['id'] . '/invoices/create'))
            ->action('Klik untuk memperpanjang Layanan', route('organization.invoice.create', ['organization' => $this->organization['id']]))
            ->line('Terima kasih telah menggunakan Layanan Keuangan Umum');
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
