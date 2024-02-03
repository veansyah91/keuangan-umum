<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $date = Carbon::now();
        User::create([
            'name' => "Ferdi Yansyah",
            'email' => "superadmin@keuangan.com",
            'password' => bcrypt('9968Siskom'),
            'email_verified_at' => $date,
            'role' => 'super-admin'
        ]);
    }
}
