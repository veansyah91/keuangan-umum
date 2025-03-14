<?php

namespace App\Repositories\Duitku;

interface DuitkuRepositoryInterface
{
    public function getPaymentMethod();
    public function createInvoice($data);
}
