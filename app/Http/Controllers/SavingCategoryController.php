<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Account;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\SavingBalance;
use App\Models\SavingCategory;
use App\Models\AccountCategory;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Validator;
use App\Repositories\Account\AccountRepository;

class SavingCategoryController extends Controller
{
	protected $userRepository, $accountRepository;

	public function __construct(UserRepository $userRepository, AccountRepository $accountRepository)
	{
		$this->userRepository = $userRepository;
		$this->accountRepository = $accountRepository;
	}
	
	public function index(Organization $organization)
	{
		$user = Auth::user();

		return Inertia::render('SavingCategory/Index', [
			'organization' => $organization,
			'accounts' => $this->accountRepository->getDataNonCash($organization['id'], request(['account'])),
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'categories' => SavingCategory::filter(request(['search']))
																			->with('account')
																			->whereOrganizationId($organization['id'])
																			->paginate(50)->withQueryString(),
		]);
	}

	public function store(Request $request, Organization $organization)
	{
		$validator = Validator::make($request->all(), [
			'name' => [
					'required',
					'string',
					Rule::unique('saving_categories')->where(function ($query) use ($organization) {
							return $query->where('organization_id', $organization['id']);
					}),
			],			
		]);

		if ($validator->fails()) {
			// Handle validation failure
			return redirect()->back()->withErrors($validator)->withInput();
		}

		$validated = $validator->validated();
		$validated['organization_id'] = $organization['id'];

		DB::transaction(function() use ($organization, $validated){
			// cari akun tabungan dengan nama yang sesuai dengan input-an data
			$account = Account::whereOrganizationId($organization['id'])
													->where('name', 'TABUNGAN ' . $validated['name'])
													->first();

			$last_account = [];

			if (!$account) {
				$accountCategory = AccountCategory::whereOrganizationId($organization['id'])
																						->whereName('TABUNGAN')
																						->first();

				if (!$accountCategory) {
					$account_category_last = AccountCategory::whereOrganizationId($organization['id'])
																										->where('code', '>', '200000000')
																										->where('code', '<', '260000000')
																										->orderBy('code', 'desc')->first();

					$accountCategory = AccountCategory::create([
						'organization_id' => $organization['id'],
						'code' => (int)$account_category_last['code'] + 1000000,
						'name' => 'TABUNGAN'
					]);

					$last_account = Account::create([
						'code' => $accountCategory['code'],
						'name' => "TABUNGAN",
						'is_cash' => false,
						'account_category_id' => $accountCategory['id'],
						'organization_id' => $organization['id'],
					]);
				} else {
					$last_account = Account::whereAccountCategoryId($accountCategory['id'])
																	->orderBy('code', 'desc')
																	->first();

					if (!$last_account) {
						$last_account = Account::create([
							'code' => $accountCategory['code'],
							'name' => "TABUNGAN",
							'is_cash' => false,
							'account_category_id' => $accountCategory['id'],
							'organization_id' => $organization['id'],
						]);
					}
				}

				$account = Account::create([
					'code' => (int)$last_account['code'] + 1,
					'name' => "TABUNGAN " . $validated['name'],
					'is_cash' => false,
					'account_category_id' => $accountCategory['id'],
					'organization_id' => $organization['id'],
				]);
			}

			$validated['account_id'] = $account['id'];

			SavingCategory::create($validated);
		});

		return redirect()->back()->with('success', 'Kategori Tabungan Berhasil Ditambahkan');
	}

	public function update(Request $request, Organization $organization, SavingCategory $category)
	{
		$validator = Validator::make($request->all(), [
			'name' => [
					'required',
					'string',
					Rule::unique('saving_categories')->where(function ($query) use ($organization) {
							return $query->where('organization_id', $organization['id']);
					})->ignore($category['id']),
			],	
			'account_id' => [
				'required',
				'numeric',
				'exists:accounts,id'
			],
			'auto_adjust' => [
				'required',
				'boolean',
			]
		]);

		$validated = $validator->validated();
		if (!$validated['auto_adjust']) {
			$account = Account::where('id', '<>', $validated['account_id'])->where('name', 'like', 'TABUNGAN ' . $validated['name'])->first();

			if ($account) {
				return redirect()->back()->withErrors(['message', 'Nama Telah digunakan pada Akun, Silakan atur akun secara manual']);
			}
		}

		DB::transaction(function() use ($validated, $organization, $category){
			$category->update($validated);

			// cek nama akun jika akun disesuaikan secara otomatis
			if ($validated['auto_adjust']) {
				$account = Account::find($category['account_id']);

				$account->update([
					'name' => 'TABUNGAN ' . $validated['name']
				]);
			}
		});

		return redirect()->back()->with('success', 'Kategori Tabungan Berhasil Diubah');
	}

	public function destroy(Organization $organization, SavingCategory $category)
	{
		// cek apakah category telah digunakan
		$balance = SavingBalance::where('saving_category_id', $category['id'])
															->first();

		if ($balance) {
			return redirect()->back()->withErrors(['error' => 'Tidak dapat menghapus, Kategori telah digunakan']);
		}

		try {
			DB::transaction(function() use($category, $organization){
				$category->delete();

				$delete_account = $this->accountRepository->deleteData($category['account_id']);

				if ($delete_account) {
					return redirect()->back()->with('success', "Kategori tabungan berhasil dihapus");
				}
				return redirect()->back()->with('success', "Kategori tabungan berhasil dihapus, tapi Gagal menghapus akun");

			});
		} catch (\Throwable $th) {
			throw $th;
		}
	}
}
