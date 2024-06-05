<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $date = Carbon::now();
        User::create([
            'name' => 'Ferdi Yansyah',
            'email' => 'superadmin@keuangan.com',
            'password' => bcrypt('9968Siskom'),
            'email_verified_at' => $date,
            'role' => 'super-admin',
        ]);
    }
}
