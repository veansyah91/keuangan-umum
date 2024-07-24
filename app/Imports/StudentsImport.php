<?php

namespace App\Imports;

use App\Models\Contact;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Queue\ShouldQueue;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class StudentsImport implements ToCollection, WithChunkReading, ShouldQueue
{
    protected $organization;
    public function __construct($organization)
    {
        $this->organization = $organization;
    }
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function collection(Collection $rows)
    {
        foreach ($rows as $key => $row) 
        {
            if ($key > 0) {
                // dd($this->organization);
                $contact = Contact::create([
                    'organization_id' => $this->organization,
                    'name' => $row[0],
                    'phone' => $row[1],
                    'alamat' => $row[2],
                ]);
            }
        }
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
