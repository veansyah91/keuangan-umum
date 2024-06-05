<?php

namespace App\Imports;

use App\Models\Regency;
use Maatwebsite\Excel\Concerns\ToModel;

class RegencyImport implements ToModel
{
    /**
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new Regency([
            'id' => $row[0],
            'province_id' => $row[1],
            'name' => $row[2],
        ]);
    }
}
