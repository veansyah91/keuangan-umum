<?php

namespace App\Repositories\Log;

interface LogRepositoryInterface
{
    public function store($organization, $message);
}
