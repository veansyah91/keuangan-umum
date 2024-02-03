<?php

namespace App\Repositories\Log;

use App\Models\Log;

class LogRepository implements LogRepositoryInterface
{
    public function store($organization, $message)
    {
        Log::create([
            'message' => $message,
            'organization_id' => $organization
        ]);
    }
}