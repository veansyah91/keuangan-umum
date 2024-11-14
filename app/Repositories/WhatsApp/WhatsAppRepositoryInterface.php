<?php

namespace App\Repositories\WhatsApp;

interface WhatsAppRepositoryInterface
{
    public function sendOrganizationInvoice($phone, $message);
}