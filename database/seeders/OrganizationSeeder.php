<?php

namespace Database\Seeders;

use App\Models\Organization;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class OrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i=0; $i < 100; $i++) { 
            # code...
            Organization::create([
                'name' => "Masjid " . fake()->name(),
                'address' => fake()->city(),
                'expired' => "2024-12-12",
            ]);
        }
    }
}
