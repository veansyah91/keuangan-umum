<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Account;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\SavingCategory;
use App\Models\AccountCategory;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Validator;

class SavingCategoryController extends Controller
{
	protected $userRepository;

	public function __construct(UserRepository $userRepository)
	{
			$this->userRepository = $userRepository;
	}
	
	public function index(Organization $organization)
	{
		$user = Auth::user();

		return Inertia::render('SavingCategory/Index', [
			'organization' => $organization,
			'role' => $this->userRepository->getRole($user['id'], $organization['id']),
			'categories' => SavingCategory::filter(request(['search']))
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
}
