<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use App\Models\Contact;
use App\Models\StudentLevel;
use Illuminate\Console\Command;

class StudentLevelUpdateCron extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'studentLevelUpdate:cron';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Perbarui Level Siswa Secara Otomatis Setiap Tahun Bulan 7';

    /**
     * Execute the console command.
     */

    protected function studyYear($date)
    {
        if ($date->month > 6) {
            return (string)$date->year . "/" . (string)$date->year + 1;
        } else {
            return (string)$date->year - 1 . "/" . (string)$date->year;
        }
    }

    public function handle()
    {
		$now = Carbon::now();
        
        if ($now->month === 7) {
            $contacts = Contact::whereHas('organization', function ($query){
                                    return $query->where('status','<>','deactive');
                                })
                                ->whereHas('lastLevel', function($query) use ($now){
                                    return $query->where('year', '<', $this->studyYear($now));
                                })
                                ->where('is_active', true)
                                ->with('lastLevel')
                                ->get();
		    \Log::info($contacts);
            
            foreach ($contacts as $contact) {
                if (($contact['lastLevel']['year'] < $this->studyYear($now)) && ($contact['lastLevel']['level'] < 12)) {
                    StudentLevel::create([
                        'contact_id' => $contact['id'],
                        'level' => $contact['lastLevel']['level'] + 1,
                        'year' => $this->studyYear($now)
                    ]);
                }                
            }
        }
    }
}
