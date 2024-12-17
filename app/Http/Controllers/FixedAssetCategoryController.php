<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Ledger;
use App\Models\Account;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\FixedAssetCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;

class FixedAssetCategoryController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository, LogRepository $logRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
        $this->now = CarbonImmutable::now();
    }

		public function setAccount($fixedAssetAccount, $organization, $name)
		{
			$no_ref = (int) $fixedAssetAccount['code'] + 1000;
			$checked = false;
			$i = 1;

			$newAccount = [];

			while ($checked == false) {
				$no_ref = (int) $fixedAssetAccount['code'] + 1000 * $i;
				
				// cek
				$account = Account::whereOrganizationId($organization['id'])
														->where('code', $no_ref)
														->first();

				if (!$account) {
					// Buat akun
					$newAccount = Account::create([
						'organization_id' => $organization['id'],
						'account_category_id' => $fixedAssetAccount['account_category_id'],
						'name' => $name,
						'code' => $no_ref,
						'is_active' => 1,
						'is_cash' => 0,
						'can_be_deleted' => 1,
					]);
					$checked = true;

				} else {
					$i++;
				}
			}

			return $newAccount;
		}

    public function index(Organization $organization)
    {
        $user = Auth::user();

        $fixedAssetCategories = FixedAssetCategory::filter(request(['search', 'status']))
            ->whereOrganizationId($organization['id'])
            ->paginate(50)->withQueryString();

        return Inertia::render('FixedAssetCategory/Index', [
            'organization' => $organization,
            'fixedAssetCategories' => $fixedAssetCategories,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'status' => request('status') == 'true' ? true : false,
            'startDate' => request('start_date'),
            'endDate' => request('end_date'),
        ]);
    }

    public function store(Request $request, Organization $organization)
    {
        $user = Auth::user();

        // validation
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('fixed_asset_categories')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                }),
            ],
            'lifetime' => 'required|numeric',
            'status' => 'required|boolean',
        ]);


        $validated['organization_id'] = $organization['id'];

				DB::transaction(function () use ($validated, $organization, $user){
        	$log = $validated;

					FixedAssetCategory::create($validated);

					// Buat akun-akun 
					// Akun Harta Tetap
					$fixedAssetAccount = Account::whereOrganizationId($organization['id'])
																->whereHas('accountCategory', function ($query) use ($validated){
																	return $query->where('name', 'HARTA TETAP BERWUJUD');
																})
																->orderBy('code', 'desc')
																->first();

					$this->setAccount($fixedAssetAccount, $organization, $validated['name']);

					// Akun Akumulasi Penyusutan Harta Tetap
					$fixedAssetDepreciationAccount = Account::whereOrganizationId($organization['id'])
																->whereHas('accountCategory', function ($query) use ($validated){
																	return $query->where('name', 'AKUMULASI PENYUSUTAN HARTA TETAP BERWUJUD');
																})
																->orderBy('code', 'desc')
																->first();

					$this->setAccount($fixedAssetDepreciationAccount, $organization, "AKUMULASI PENYUSUTAN " . $validated['name']);

					// Akun Beban Penyusutan Harta Tetap
					$fixedAssetCostDepreciationAccount = Account::whereOrganizationId($organization['id'])
																->whereHas('accountCategory', function ($query) use ($validated){
																	return $query->where('name', 'BEBAN PENYUSUTAN');
																})
																->orderBy('code', 'desc')
																->first();

					$this->setAccount($fixedAssetCostDepreciationAccount, $organization, "BEBAN PENYUSUTAN " . $validated['name']);
																
					$this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada KELOMPOK HARTA TETAP dengan DATA : '.json_encode($log));
				});

        return redirect()->back();
    }

    public function update(Request $request, Organization $organization, FixedAssetCategory $fixedAssetCategory)
    {
        $user = Auth::user();

        // validation
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('fixed_asset_categories')->ignore($fixedAssetCategory['id']),
            ],
            'lifetime' => 'required|numeric',
            'status' => 'required|boolean',
        ]);

        $log = $validated;

        $validated['organization_id'] = $organization['id'];

				// perbarui akun akun
				// akun harta tetap
				// Akun Harta Tetap
				$fixedAssetAccount = Account::whereOrganizationId($organization['id'])
																			->where('name', 'like', '%' . $fixedAssetCategory['name'] . '%')
																			->whereHas('accountCategory', function ($query) use ($validated){
																				return $query->where('name', 'HARTA TETAP BERWUJUD');
																			})
																			->orderBy('code', 'desc')
																			->first();

				if ($fixedAssetAccount) {
					$fixedAssetAccount->update([
						'name' => $validated['name']
					]);
				}				

				// akun akumulasi penyusutan
				$fixedAssetDepreciationAccount = Account::whereOrganizationId($organization['id'])
																									->where('name', 'like', '%' . $fixedAssetCategory['name'] . '%')
																									->whereHas('accountCategory', function ($query) use ($validated){
																										return $query->where('name', 'AKUMULASI PENYUSUTAN HARTA TETAP BERWUJUD');
																									})
																									->orderBy('code', 'desc')
																									->first();
				if ($fixedAssetDepreciationAccount) {
					$fixedAssetDepreciationAccount->update([
						'name' => "AKUMULASI PENYUSUTAN " . $validated['name']
					]);
				}				

				// akun beban penyusutan
				$fixedAssetCostDepreciationAccount = Account::whereOrganizationId($organization['id'])
																											->where('name', 'like', '%' . $fixedAssetCategory['name'] . '%')
																											->whereHas('accountCategory', function ($query) use ($validated){
																												return $query->where('name', 'BEBAN PENYUSUTAN');
																											})
																											->orderBy('code', 'desc')
																											->first();
				if ($fixedAssetDepreciationAccount) {
					$fixedAssetDepreciationAccount->update([
						'name' => "BEBAN PENYUSUTAN " . $validated['name']
					]);
				}			

        $fixedAssetCategory->update($validated);

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah mengubah DATA pada KELOMPOK HARTA TETAP menjadi : '.json_encode($log));

        return redirect()->back();
    }

    public function destroy(Organization $organization, FixedAssetCategory $fixedAssetCategory)
    {
        $user = Auth::user();

        // cek apakah kelompok harta tetap telah digunakan
				// cek akun harta tetap
				$accounts = Account::whereOrganizationId($organization['id'])
														->where('name', 'like', '%' . $fixedAssetCategory['name'] . '%') 
														->orderBy('code')
														->get();

				// cek di buku besar
				$ledger = Ledger::whereOrganizationId($organization['id'])
													->whereAccountId($accounts[0]['id'])
													->first();

				// jika akun telah digunakan, maka tampilkan pesan error
				if ($ledger) {
					return redirect()->back()->withErrors(['message' => 'Data tidak dapat dihapus karena telah digunakan!']);
				}

				foreach ($accounts as $account) {
					$account->delete();
				}

        $log = [
            'name' => $fixedAssetCategory['name'],
            'lifetime' => $fixedAssetCategory['lifetime'],
            'status' => $fixedAssetCategory['status'],
        ];

        $fixedAssetCategory->delete();

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menghapus DATA pada KATEGORI AKUN : '.json_encode($log));

        return redirect()->back();
        dd($fixedAssetCategory);
    }
}
