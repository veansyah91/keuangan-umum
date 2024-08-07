<?php

namespace App\Repositories\Village;

use App\Models\Village;

class VillageRepository implements VillageRepositoryInterface
{
    public function getFullAddress($filter)
    {
        // dd($filter);
        $village = Village::filter($filter)
            ->with('district', function ($query) {
                $query->with('regency', function ($query) {
                    $query->with('province');
                });
            })
            ->take(10)
            ->get();

        return $village;
    }
}
