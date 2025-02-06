<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\SavingCategorySeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // Perbarui Halaman
        $this->call(MenuSeeder::class);
        $this->call(OrganizationMenuSeeder::class);
        $this->call(SavingCategorySeeder::class);

        // sesuaikan akun sekolah dengan akun staff
    }
}
