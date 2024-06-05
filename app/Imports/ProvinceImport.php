<?php

namespace App\Imports;

use App\Models\Province;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class ProvinceImport implements ToCollection
{
    /**
     * @param  array  $row
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    // public function model(array $row)
    // {
    //     return new Province([
    //         'id' => (int)$row[0],
    //         'name' => $row[1],
    //     ]);
    // }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            Province::updateOrInsert(
                ['id' => $row[0]],
                ['name' => $row[1]]
            );
        }
    }
}
