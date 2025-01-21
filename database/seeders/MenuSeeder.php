<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MenuSeeder extends Seeder
{
    protected $menus = [
       [
        "name" => "SISWA",
        "page" => "DATA MASTER"
       ],
       [
        "name" => "STAFF",
        "page" => "DATA MASTER"
       ],
       [
        "name" => "SEKOLAH",
        "page" => "BUKU BESAR"
       ],
       [
        "name" => "STAFF",
        "page" => "BUKU BESAR"
       ],
       [
        "name" => "SISWA",
        "page" => "ARUS KAS"
       ],
       [
        "name" => "STAFF",
        "page" => "ARUS KAS"
       ],
       [
        "name" => "SIMPAN PINJAM",
        "page" => "ARUS KAS"
       ],
    ];
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach ($this->menus as $menu) {
            $data = Menu::where('name', $menu['name'])->where('page', $menu['page'])->first();

            if (!$data) {
                Menu::create($menu);
            }
        }
    }
}
