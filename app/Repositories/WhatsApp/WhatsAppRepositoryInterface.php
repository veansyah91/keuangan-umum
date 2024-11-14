<?php

namespace App\Repositories\WhatsApp;

interface WhatsAppRepositoryInterface
{
    public function sendMessage($data);
}