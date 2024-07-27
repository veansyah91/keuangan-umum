<?php

namespace App\Imports;

use App\Models\Contact;
use App\Models\ContactStaff;
use App\Models\ContactCategory;
use Illuminate\Support\Collection;
use Illuminate\Contracts\Queue\ShouldQueue;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class StaffImport implements ToCollection, WithChunkReading, ShouldQueue
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
            $contactCategory = ContactCategory::whereOrganizationId($this->organization)
                                                ->whereName('STAF')
                                                ->first();
                                                
            if ($key > 0) {
                $contact = Contact::create([
                    'organization_id' => $this->organization,
                    'name' => strtoupper($row[0]),
                    'phone' => $row[1],
                    'alamat' => strtoupper($row[2]),
                    'description' => $row[6]
                ]);

                $contact->contactCategories()->attach(['category' => $contactCategory['id']]);

                $contactStudent = ContactStaff::create([
                    'contact_id' => $contact['id'],
                    'entry_year' => $row[3],
                    'no_ref' => strtoupper($row[4]),
                    'position' => strtoupper($row[5]),
                    'description' => $row[6]
                ]);
            }
        }
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
