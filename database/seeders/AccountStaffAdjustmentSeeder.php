<?php

namespace Database\Seeders;

use App\Models\AccountStaff;
use App\Models\Organization;
use Illuminate\Database\Seeder;
use App\Models\SchoolAccountSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AccountStaffAdjustmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizations = Organization::all();

        foreach ($organizations as $organization) {
            // cek account school
            $accountSchool = SchoolAccountSetting::where('organization_id', $organization['id'])
                                        ->first();

            // cek account staff
            $accountStaff = AccountStaff::where('organization_id', $organization['id'])
                                            ->first();

            // jika account school memiliki data maka lakukan 
            if ($accountSchool && !$accountStaff) {
                // jika account staff kosong
                AccountStaff::create([
                    'organization_id' => $organization['id'],
                    'staff_salary_expense' => $accountSchool["staff_salary_expense"]
                ]);
            }
            
        }
    }
}
