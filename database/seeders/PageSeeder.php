<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PageSeeder extends Seeder
{
    protected $pages = [
        "DASBOR",
        "DATA MASTER",
        "BUKU BESAR",
        "ARUS KAS",
        "LAPORAN"
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->pages as $page) {
            // echo $page;
            $data = Page::where('name', $page)->first();

            if (!$data) {
                Page::create([
                    'name' => $page
                ]);
            }
        }
    }
}
