<?php

namespace App\Repositories\Account;

interface AccountRepositoryInterface
{
    public function store($validated);
}
