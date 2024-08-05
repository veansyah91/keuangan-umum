<?php

namespace App\Repositories\Account;

interface AccountRepositoryInterface
{
    public function getData($organizationId, $request);
    public function getDataNonCash($organizationId, $request);
}
