<?php

namespace Database\Seeders;

use App\Models\Menu;
use App\Models\Organization;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class OrganizationMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizations = Organization::all();

        foreach ($organizations as $organization) {
            $menus = Menu::all();

            foreach ($menus as $menu) {
                $data = DB::table('organization_menu')
                            ->where('organization_id', $organization['id'])
                            ->where('menu_id', $menu['id'])
                            ->first();

                if (!$data) {
                    DB::table('organization_menu')
                        ->insert([
                            'organization_id' => $organization['id'],
                            'menu_id' => $menu['id'],
                        ]);
                }
            }
        }
    }
}
