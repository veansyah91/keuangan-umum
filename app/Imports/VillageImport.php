<?php

namespace App\Imports;

use App\Models\Village;
use Illuminate\Contracts\Queue\ShouldQueue;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class VillageImport implements ShouldQueue, ToModel, WithChunkReading
{
    /**
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new Village([
            'id' => $row[0],
            'district_id' => $row[1],
            'name' => $row[2],
        ]);
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
