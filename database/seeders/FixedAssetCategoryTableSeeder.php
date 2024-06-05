<?php

namespace Database\Seeders;

use App\Models\FixedAssetCategory;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class FixedAssetCategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'lifetime' => 0,
                'name' => 'TANAH',
                'status' => true,
            ],
            [
                'lifetime' => 48,
                'name' => 'MESIN DAN PERALATAN',
                'status' => true,
            ],
            [
                'lifetime' => 96,
                'name' => 'KENDARAAN',
                'status' => true,
            ],
            [
                'lifetime' => 48,
                'name' => 'HARTA LAINNYA',
                'status' => true,
            ],
            [
                'lifetime' => 240,
                'name' => 'GEDUNG',
                'status' => true,
            ],
        ];
        $organizations = Organization::all();

        foreach ($organizations as $organization) {
            foreach ($data as $d) {
                $d['organization_id'] = $organization['id'];
                FixedAssetCategory::create($d);

            }
        }
    }
}
