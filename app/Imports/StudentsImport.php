<?php

namespace App\Imports;

use Carbon\Carbon;
use App\Models\Contact;
use App\Models\StudentLevel;
use App\Models\ContactStudent;
use App\Models\ContactCategory;
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

    public function studyYear()
    {
        $date = Carbon::now();
        $month = $date->month;
        $year = $date->year;

        return $month < 7 ? $year - 1 . "/" . $year : $year . "/" . $year + 1;
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
                                                ->whereName('SISWA')
                                                ->first();
                                                
            if ($key > 0) {
                $contact = Contact::create([
                    'organization_id' => $this->organization,
                    'name' => strtoupper($row[0]),
                    'phone' => $row[1],
                    'alamat' => strtoupper($row[2]),
                ]);

                $contact->contactCategories()->attach(['category' => $contactCategory['id']]);

                $contactStudent = ContactStudent::create([
                    'contact_id' => $contact['id'],
                    'father_name' => strtoupper($row[6]),
                    'mother_name' => strtoupper($row[7]),
                    'entry_year' => $row[3],
                    'no_ref' => strtoupper($row[4]),
                ]);

                $studentLevel = StudentLevel::create([
                    'contact_id' => $contact['id'],
                    'level' => $row[5],
                    'year' => $this->studyYear()
                ]);

            }
        }
    }

    public function chunkSize(): int
    {
        return 1000;
    }
}
