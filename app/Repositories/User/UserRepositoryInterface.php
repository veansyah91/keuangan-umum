<?php

namespace App\Repositories\User;

interface UserRepositoryInterface
{
    public function getOrganization($user, $organization);

    public function getRole($user, $organization);
    
}