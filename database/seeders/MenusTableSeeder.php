<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenusTableSeeder extends Seeder
{
	public $menus = [
		[
			'page' => 'Data Master',
			'name' => 'Siswa'
		],
		[
			'page' => 'Data Master',
			'name' => 'Staf'
		],
	];
	
	public function run(): void
	{
			
	}
}
