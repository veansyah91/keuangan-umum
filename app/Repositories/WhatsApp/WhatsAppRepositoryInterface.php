<?php

namespace App\Repositories\WhatsApp;

interface WhatsAppRepositoryInterface
{
    public function sendMessage($data);
    public function sendMessageViaFonte($data);
    public function sendMultiMessageViaFonte($data);
}