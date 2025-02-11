<?php

namespace App\Notifications;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class OrganizationCreated extends Notification implements ShouldQueue
{
    use Queueable;

    private $organization;

    /**
     * Create a new notification instance.
     */
    public function __construct($organization)
    {
        $this->organization = $organization;
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
        $tempDate = new Carbon($this->organization->expired);
        return (new MailMessage)
                    ->subject('Pembuatan Organisasi/Bisnis Baru')
                    ->line('Nama Organisasi: '. $this->organization->name)
                    ->line('Tipe: '. $this->organization->type)
                    ->line('Status: '. $this->organization->status)
                    ->line('Kadaluarsa: '. $tempDate->isoFormat('D MMMM YYYY'));
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
