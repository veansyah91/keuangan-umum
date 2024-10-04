<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use App\Models\Contact;
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
		\Log::info($now->month);
		\Log::info($this->studyYear($now));
        
        // if ($now->month === 7) {
        //     $contacts = Contact::whereHas('or')
        // }
    }
}
