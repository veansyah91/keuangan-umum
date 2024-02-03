<?php

namespace App\Repositories\User;

use App\Models\User;

class UserRepository implements UserRepositoryInterface
{
    public function getOrganization($user, $organization)
    {
        return User::whereId($user)
                        ->whereHas('organizations', function ($query) use ($organization){
                            $query->where('organization_id', $organization)
                                    ->where('is_waiting', false);
                        })
                        ->with('organizations', function ($query) use ($organization){
                            $query->where('organization_id', $organization)
                                    ->where('is_waiting', false);
                        })
                        ->first();
    }

    public function getRole($user, $organization){
        $data = User::whereId($user)
                    ->whereHas('organizations', function ($query) use ($organization){
                        $query->where('organization_id', $organization)
                                ->where('is_waiting', false);
                    })
                    ->with('organizations', function ($query) use ($organization){
                        $query->where('organization_id', $organization)
                                ->where('is_waiting', false);
                    })
                    ->first();

        return $data->organizations[0]['pivot']['role'];
    }
}