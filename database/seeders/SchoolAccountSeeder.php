<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Organization;
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
			'UMUM',
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
				'revenue_student_account_id' => null,
				'receivable_student_account_id' => null,
				'prepaid_student_account_id' => null,
				'staff_salary_expense_account_id' => null,
				'entry_student_account_id' => null
			];

			$accountCategoriesCollection->map(function ($accountCategory) use ($accountsData, $organization) {
				$filteredAccount = $accountsData->where('category_name', $accountCategory['name']);

				$filteredAccount->map(function ($account) use ($accountCategory, $organization) {
						$accountDB = Account::create([
							'code' => $account['code'],
							'name' => $account['name'],
							'account_category_id' => $accountCategory['id'],
							'organization_id' => $organization['id']
						]);

						// akun pendapatan iuran bulanan siswa
						if ($accountDB['name'] == 'PENDAPATAN IURAN BULANAN SISWA') {
							$attribute['revenue_student_account_id'] = $accountDB['id'];
							dd($attribute);
						}
						if ($accountDB['name'] == 'PIUTANG IURAN BULANAN SISWA') {
							$attribute['receivable_student_account_id'] = $accountDB['id'];
						}
						if ($accountDB['name'] == 'PENDAPATAN IURAN BULANAN SISWA DITERIMA DI MUKA') {
							$attribute['prepaid_student_account_id'] = $accountDB['id'];
						}
						if ($accountDB['name'] == 'PENDAPATAN IURAN MASUK SISWA') {
							$attribute['entry_student_account_id'] = $accountDB['id'];
						}
						return $accountDB;
				});
			});

			SchoolAccountSetting::create($attribute);

			return;
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
