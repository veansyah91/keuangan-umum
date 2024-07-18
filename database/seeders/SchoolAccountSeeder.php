<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Organization;
use App\Models\AccountCategory;
use App\Models\ContactCategory;
use Illuminate\Database\Seeder;
use App\Models\SchoolAccountSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class SchoolAccountSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$organizations = Organization::orderBy('created_at')->get();

		$accountCategoriesData = collect([
				[
						'code' => '121000000',
						'name' => 'PIUTANG IURAN BULANAN SISWA',
				],
				[
						'code' => '211000000',
						'name' => 'UTANG GAJI STAFF',
				],
				[
						'code' => '221000000',
						'name' => 'PENDAPATAN IURAN BULANAN SISWA DITERIMA DI MUKA',
				],
				[
						'code' => '430000000',
						'name' => 'PENDAPATAN IURAN BULANAN SISWA',
				],
				[
						'code' => '431000000',
						'name' => 'PENDAPATAN IURAN MASUK SISWA',
				],
		]);

		$accountsData = collect([
			[
					'category_name' => 'PIUTANG IURAN BULANAN SISWA',
					'code' => '121000000',
					'name' => 'PIUTANG IURAN BULANAN SISWA',
			],
			[
					'category_name' => 'PENDAPATAN IURAN BULANAN SISWA DITERIMA DI MUKA',
					'code' => '221000000',
					'name' => 'PENDAPATAN IURAN BULANAN SISWA DITERIMA DI MUKA',
			],
			[
					'category_name' => 'PENDAPATAN IURAN BULANAN SISWA',
					'code' => '430000000',
					'name' => 'PENDAPATAN IURAN BULANAN SISWA',
			],
			[
					'category_name' => 'PENDAPATAN IURAN MASUK SISWA',
					'code' => '431000000',
					'name' => 'PENDAPATAN IURAN MASUK SISWA',
			],
			[
					'category_name' => 'BEBAN OPERASIONAL',
					'code' => '620000000',
					'name' => 'BEBAN GAJI GURU',
			],
		]);
		
		$contactCategoriesData = collect([
			'SISWA',
			'GURU'
		]);

		foreach ($organizations as $organization) {
			// akun akun
			// Kategori Akun
			$accountCategoriesCollection = $accountCategoriesData->map(function ($accountCategory) use ($organization){
				return $organization->accountCategory()->create($accountCategory);
			});

			$attribute = [
				'organization_id' => $organization['id'],
			];

			foreach ($accountCategoriesCollection as $accountCategory) {
				$filteredAccounts = $accountsData->where('category_name', $accountCategory['name']);

				foreach ($filteredAccounts as $filteredAccount) {
					$account = Account::create([
						'code' => $filteredAccount['code'],
						'name' => $filteredAccount['name'],
						'account_category_id' => $accountCategory['id'],
						'organization_id' => $organization['id']
					]);
				}
				
				// akun pendapatan iuran bulanan siswa
				if ($account['name'] == 'PENDAPATAN IURAN BULANAN SISWA') {
					$attribute['revenue_student_account_id'] = $account['id'];
				}
				if ($account['name'] == 'PIUTANG IURAN BULANAN SISWA') {
					$attribute['receivable_student_account_id'] = $account['id'];
				}
				if ($account['name'] == 'PENDAPATAN IURAN BULANAN SISWA DITERIMA DI MUKA') {
					$attribute['prepaid_student_account_id'] = $account['id'];
				}
				if ($account['name'] == 'PENDAPATAN IURAN MASUK SISWA') {
					$attribute['entry_student_account_id'] = $account['id'];
				}
			}

			$accountCategoryOperational = AccountCategory::whereOrganizationId($organization['id'])->whereName('BEBAN OPERASIONAL')->first();
			$filteredAccount = $accountsData->where('category_name', $accountCategoryOperational['name'])->first();
			$account = Account::create([
				'code' => $filteredAccount['code'],
				'name' => $filteredAccount['name'],
				'account_category_id' => $accountCategory['id'],
				'organization_id' => $organization['id']
			]);
			$attribute['staff_salary_expense_account_id'] = $account['id'];

			SchoolAccountSetting::create($attribute);
			
			// kategori kontak
			foreach ($contactCategoriesData as $contactCategory) {
				ContactCategory::create([
					'name' => $contactCategory,
					'organization_id' => $organization['id'],
				]);
			}
		}
			
	}
}
