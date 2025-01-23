<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Organization;
use App\Models\SavingCategory;
use App\Models\AccountCategory;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SavingCategorySeeder extends Seeder
{
	/**
	 * Run the database seeds.
	*/
	public function run(): void
	{
		$organizations = Organization::all();
		
		foreach ($organizations as $organization) {
			// cek apakah sudah dibuat data SAVING CATEGORY
			$savingCategory = SavingCategory::whereOrganizationId($organization['id'])->first();

			if (!$savingCategory) {
				// cek apakah sudah ada kategori akun bernama TABUNGAN
				$accountCategory = AccountCategory::where('organization_id', $organization['id'])
																->where('name', 'TABUNGAN')
																->first();
				
				if ($accountCategory) {
					$last_account = Account::where('account_category_id', $accountCategory['id'])->first();

					// cek akun yang memiliki nama TABUNGAN UMUM,
					// jika belum ada maka buat baru
					$account = Account::where('organization_id', $organization['id'])
														->where('name', 'TABUNGAN UMUM')
														->first();

					if (!$account) {	
						$account = Account::create([
							'code' => (int)$last_account['code'] + 1,
							'name' => "TABUNGAN UMUM",
							'is_cash' => false,
							'account_category_id' => $accountCategory['id'],
							'organization_id' => $organization['id'],
						]);									
					}		

					SavingCategory::create([
						'name' => "UMUM",
						'organization_id' => $organization['id'],
						'account_id' => $account['id']
					]);
				}						
			}
		}
	}
}
