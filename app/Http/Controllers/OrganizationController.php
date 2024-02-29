<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\ContactCategory;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use App\Repositories\Village\VillageRepository;
use App\Repositories\Account\AccountRepositoryInterface;
use App\Repositories\AccountCategory\AccountCategoryRepositoryInterface;


class OrganizationController extends Controller
{
    protected $accountCategoriesDefault = [
        // Neraca
        // Aset Lancar
        [
            'code' => '110000000',
            'name' => 'KAS',
        ],
        [
            'code' => '112000000',
            'name' => 'BANK',
        ],
        [
            'code' => '120000000',
            'name' => 'PIUTANG',
        ],
        [
            'code' => '130000000',
            'name' => 'BIAYA DIBAYAR DI MUKA',
        ],
        [
            'code' => '131000000',
            'name' => 'PAJAK DIBAYAR DI MUKA',
        ],
        [
            'code' => '150000000',
            'name' => 'PERSEDIAAN',
        ],
        //
        // Aset Tetap
        // Kode 16xxxx Digunakan jika Yayasan memiliki Lembaga di bawahnya
        [
            'code' => '160000000',
            'name' => 'INVESTASI',
        ],
        [
            'code' => '170000000',
            'name' => 'HARTA TETAP BERWUJUD',
        ],
        [
            'code' => '171000000',
            'name' => 'AKUMULASI PENYUSUTAN HARTA TETAP BERWUJUD',
        ],
        //
        // Utang
        [
            'code' => '210000000',
            'name' => 'KEWAJIBAN',
        ],
        [
            'code' => '220000000',
            'name' => 'PENDAPATAN DITERIMA DI MUKA',
        ],
        [
            'code' => '230000000',
            'name' => 'TABUNGAN',
        ],
        [
            'code' => '240000000',
            'name' => 'UTANG PAJAL',
        ],
        [
            'code' => '260000000',
            'name' => 'UTANG JANGKA PANJANG',
        ],
        //
        // Modal
        [
            'code' => '310000000',
            'name' => 'MODAL',
        ],
        [
            'code' => '320000000',
            'name' => 'LABA',
        ],
        //
        // Pendapatan
        [
            'code' => '410000000',
            'name' => 'PENDAPATAN DARI DONATUR TETAP',
        ],
        [
            'code' => '420000000',
            'name' => 'PENDAPATAN DARI SUMBANGAN',
        ],
        //
        // Pengeluaran Variabel
        [
            'code' => '510000000',
            'name' => 'AKOMODASI USTAD',
        ],
        [
            'code' => '520000000',
            'name' => 'PENGELUARAN RAPAT',
        ],
        //
        // Pengeluaran Tetap
        [
            'code' => '610000000',
            'name' => 'BEBAN OPERASIONAL',
        ],
        [
            'code' => '620000000',
            'name' => 'BEBAN ADMINISTRASI DAN UMUM',
        ],
        //
        // Beban Penyusutan
        [
            'code' => '710000000',
            'name' => 'BEBAN PENYUSUTAN',
        ],
        //
    ];

    protected $accountsDefault = [
        [
            'category_name' => 'KAS',
            'code' => '111000000',
            'name' => 'KAS',
            'is_cash' => true,
        ],
        [
            'category_name' => 'BANK',
            'code' => '112000000',
            'name' => 'BANK',
            'is_cash' => true,
        ],
        [
            'category_name' => 'PIUTANG',
            'code' => '120000000',
            'name' => 'PIUTAN',
        ],
        [
            'category_name' => 'BIAYA DIBAYAR DI MUKA',
            'code' => '130000000',
            'name' => 'BIAYA DIBAYAR DI MUKA',
        ],
        [
            'category_name' => 'PAJAK DIBAYAR DI MUKA',
            'code' => '131000000',
            'name' => 'PAJAK DIBAYAR DI MUKA',
        ],
        [
            'category_name' => 'PERSEDIAAN',
            'code' => '150000000',
            'name' => 'PERSEDIAAN',
        ],
        [
            'category_name' => 'INVESTASI',
            'code' => '160000000',
            'name' => 'INVESTASI',
        ],
        [
            'category_name' => 'HARTA TETAP BERWUJUD',
            'code' => '170000000',
            'name' => 'TANAH',
        ],
        [
            'category_name' => 'HARTA TETAP BERWUJUD',
            'code' => '170100000',
            'name' => 'BANGUNAN',
        ],
        [
            'category_name' => 'AKUMULASI PENYUSUTAN HARTA TETAP BERWUJUD',
            'code' => '171100000',
            'name' => 'AKUMULASI PENYUSUTAN BANGUNAN',
        ],
        [
            'category_name' => 'HARTA TETAP BERWUJUD',
            'code' => '170200000',
            'name' => 'KENDARAAN',
        ],
        [
            'category_name' => 'AKUMULASI PENYUSUTAN HARTA TETAP BERWUJUD',
            'code' => '171200000',
            'name' => 'AKUMULASI PENYUSUTAN KENDARAAN',
        ],
        [
            'category_name' => 'HARTA TETAP BERWUJUD',
            'code' => '170300000',
            'name' => 'PERALATAN',
        ],
        [
            'category_name' => 'HARTA TETAP BERWUJUD',
            'code' => '171300000',
            'name' => 'AKUMULASI PENYUSUTAN PERALATAN',
        ],
        [
            'category_name' => 'KEWAJIBAN',
            'code' => '210000000',
            'name' => 'KEWAJIBAN',
        ],
        [
            'category_name' => 'PENDAPATAN DITERIMA DI MUKA',
            'code' => '220000000',
            'name' => 'PENDAPATAN DITERIMA DI MUKA',
        ],
        [
            'category_name' => 'UTANG PAJAK',
            'code' => '230000000',
            'name' => 'UTANG PAJAK',
        ],
        [
            'category_name' => 'TABUNGAN',
            'code' => '240000000',
            'name' => 'TABUNGAN',
        ],
        [
            'category_name' => 'MODAL',
            'code' => '310000000',
            'name' => 'MODAL',
        ],
        [
            'category_name' => 'LABA',
            'code' => '320000000',
            'name' => 'LABA TAHUN BERJALAN',
        ],
        [
            'category_name' => 'LABA',
            'code' => '320000001',
            'name' => 'LABA DITAHAN',
        ],
        [
            'category_name' => 'PENDAPATAN DARI DONATUR TETAP',
            'code' => '410000000',
            'name' => 'PENDAPATAN DARI DONATUR TETAP',
        ],
        [
            'category_name' => 'PENDAPATAN DARI SUMBANGAN',
            'code' => '420000000',
            'name' => 'PENDAPATAN DARI SUMBANGAN',
        ],
        [
            'category_name' => 'AKOMODASI USTAD',
            'code' => '510000000',
            'name' => 'AKOMODASI USTAD',
        ],
        [
            'category_name' => 'PENGELUARAN RAPAT',
            'code' => '520000000',
            'name' => 'PENGELUARAN RAPAT',
        ],
        [
            'category_name' => 'BEBAN OPERASIONAL',
            'code' => '610000000',
            'name' => 'BEBAN OPERASIONAL',
        ],
        [
            'category_name' => 'BEBAN OPERASIONAL',
            'code' => '610000001',
            'name' => 'BEBAN LISTRIK',
        ],
        [
            'category_name' => 'BEBAN OPERASIONAL',
            'code' => '610000002',
            'name' => 'BEBAN AIR',
        ],
        [
            'category_name' => 'BEBAN OPERASIONAL',
            'code' => '620000000',
            'name' => 'BEBAN GAJI',
        ],
        [
            'category_name' => 'BEBAN PENYUSUTAN',
            'code' => '711000000',
            'name' => 'BEBAN PENYUSUTAN BANGUNAN',
        ],
        [
            'category_name' => 'BEBAN PENYUSUTAN',
            'code' => '712000000',
            'name' => 'BEBAN PENYUSUTAN KENDARAAN',
        ],
        [
            'category_name' => 'BEBAN PENYUSUTAN',
            'code' => '713000000',
            'name' => 'BEBAN PENYUSUTAN PERALATAN',
        ],
    ];

    private $accountCategory;

    private $account;

    public function __construct(AccountRepositoryInterface $account, AccountCategoryRepositoryInterface $accountCategory)
    {
        $this->account = $account;
        $this->accountCategory = $accountCategory;
    }

    public function index(): Response
    {
        $user = Auth::user();

        $organizations = Organization::filter(request(['search']))
                        ->whereHas('users', function ($query) use ($user) {
                            $query->where('user_id', $user['id']);
                        })
                        ->with('users', function ($query) use ($user) {
                            $query->where('user_id', $user['id']);
                        })
                        ->get();

        return Inertia::render('Organization/Index',
            [
                'organizations' => $organizations,
                'searchFilter' => request('search'),
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $villages = new VillageRepository;
        
        return Inertia::render('Organization/Create', [
            'villages' => $villages->getFullAddress(request(['village'])),
            'villageFilter' => request('village')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        // validation
        $validated = $request->validate([
            'name' => [
                    'required',
                    'string',
                    'max:255',
                    Rule::unique('organizations')
                ],
            'address' => 'required|string|max:255',
            'legality' => 'string|nullable',
            'addressDetail.province' => 'string|nullable',
            'addressDetail.province_id' => 'string|nullable',
            'addressDetail.regency' => 'string|nullable',
            'addressDetail.regency_id' => 'string|nullable',
            'addressDetail.district' => 'string|nullable',
            'addressDetail.district_id' => 'string|nullable',
            'addressDetail.village' => 'string|nullable',
            'addressDetail.village_id' => 'string|nullable',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        // Trial 1 Month
        $now = Carbon::now();
        $validated['expired'] = $now->add(1, 'month');
        $validated['province'] = $validated['addressDetail']['province'];
        $validated['province_id'] = $validated['addressDetail']['province_id'];
        $validated['regency'] = $validated['addressDetail']['regency'];
        $validated['regency_id'] = $validated['addressDetail']['regency_id'];
        $validated['district'] = $validated['addressDetail']['district'];
        $validated['district_id'] = $validated['addressDetail']['district_id'];
        $validated['village'] = $validated['addressDetail']['village'];
        $validated['village_id'] = $validated['addressDetail']['village_id'];
        $organization = Organization::create($validated);
        $organization['role'] = 'admin';

        $request->user()->organizations()->attach($organization);

        //create default account category (accountancy)
        $accountCategoriesDefault = collect($this->accountCategoriesDefault);

        $accountCategoriesCollection = $accountCategoriesDefault->map(function ($accountCategory) use ($organization) {
            return $organization->accountCategory()->create($accountCategory);
        });
        //
        //create default account (accountancy)
        $accountsDefault = collect($this->accountsDefault);

        $accountCategoriesCollection->map(function ($accountCategory) use ($accountsDefault) {
            $filteredAccount = $accountsDefault->where('category_name', $accountCategory['name']);

            $filteredAccount->map(function ($account) use ($accountCategory) {
                $account['organization_id'] = $accountCategory['organization_id'];
                $account['can_be_deleted'] = $account['code'] == '320000000' ? false : true;

                return $accountCategory->accounts()->create($account);
            });
        });
        //

        // Category
        ContactCategory::create([
            'name' => 'UMUM',
            'organization_id' => $organization['id']
        ]);

        return redirect(route('organization'))->with('success', 'Organisasi Berhasil Disimpan!');

    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization)
    {
        $organization['date'] = $organization->created_at->isoFormat('D MMMM Y');
        $expiredDate = new Carbon($organization['expired']);
        $organization['expiredId'] = $expiredDate->isoFormat('D MMMM Y');
        $organization['diffExpired'] = $expiredDate->diffForHumans();

        return Inertia::render('Organization/Show', compact('organization'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization)
    {
        $villages = new VillageRepository;
        
        return Inertia::render('Organization/Edit', [
            'organization' => $organization,
            'villages' => $villages->getFullAddress(request(['village']) ? request(['village']) : ['village' => $organization['village']]),
            'villageFilter' => request('village') ?? $organization['village']
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization): RedirectResponse
    {
        // validation
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('organizations')->ignore($organization['id'])
            ],
            'address' => 'required|string|max:255',
            'legality' => 'string|nullable',
            'addressDetail.province' => 'string|nullable',
            'addressDetail.province_id' => 'string|nullable',
            'addressDetail.regency' => 'string|nullable',
            'addressDetail.regency_id' => 'string|nullable',
            'addressDetail.district' => 'string|nullable',
            'addressDetail.district_id' => 'string|nullable',
            'addressDetail.village' => 'string|nullable',
            'addressDetail.village_id' => 'string|nullable',
        ]);

        $validated['province'] = $validated['addressDetail']['province'];
        $validated['province_id'] = $validated['addressDetail']['province_id'];
        $validated['regency'] = $validated['addressDetail']['regency'];
        $validated['regency_id'] = $validated['addressDetail']['regency_id'];
        $validated['district'] = $validated['addressDetail']['district'];
        $validated['district_id'] = $validated['addressDetail']['district_id'];
        $validated['village'] = $validated['addressDetail']['village'];
        $validated['village_id'] = $validated['addressDetail']['village_id'];

        $organization->update($validated);

        return redirect(route('organization'))->with('success', 'Organisasi Berhasil Diubah!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization)
    {
        //
    }

    public function shareToOther(Organization $organization): Response
    {
        $user = Auth::user();

        $userOrganization = $user->organizations()->find($organization['id']);

        $organization->users;

        $users = User::where('email', request('user'))
                        ->get();

        return Inertia::render('Organization/ShareToOther', [
            'organization' => $organization,
            'users' => $users,
            'userFilter' => request('user'),
            'userOrganization' => $userOrganization
        ]);
    }

    public function shareToOtherStore(Request $request, Organization $organization): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|numeric',
            'organization_id' => 'required|string',
            'role' => ['required', Rule::in(['viewer','editor'])],
        ]);

        $user = User::findOrFail($validated['user_id']);

        //cek apakah user sudah pernah tertaut
        $organizationUser = User::whereId($validated['user_id'])
                                ->whereHas('organizations', function ($query) use ($validated){
                                    $query->where('organization_id', $validated['organization_id']);
                                })
                                ->first();

        if($organizationUser){
            return redirect(route('organization.share-to-other', $organization['id']))->withErrors(['user_id' => 'The user is added'])->withInput();
        }

        $user->organizations()->attach($organization, [
            'role' => $validated['role'],
            'is_waiting' => true
        ]);
        
        return redirect(route('organization.share-to-other', $organization['id']));
    }

    public function shareToOtherUpdate(Request $request, Organization $organization): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|numeric',
            'organization_id' => 'required|string',
            'role' => ['required', Rule::in(['viewer','editor'])],
        ]);

        $user = User::findOrFail($validated['user_id']);

        $user->organizations()->syncWithoutDetaching([
            $organization['id'] => ['role' => $validated['role']]
        ]);
        return redirect(route('organization.share-to-other', $organization['id']));
    }

    public function shareToOtherPatchConfirmation(Request $request, Organization $organization): RedirectResponse
    {
        $validated = $request->validate([
            'confirm' => 'required|boolean',
            'user_id' => 'required|numeric',
            'organization_id' => 'required|string',
            'is_waiting' => 'required|boolean',
        ]);
        
        $user = User::findOrFail($validated['user_id']);

        if ($validated['confirm']) {
            //ubah status menunggu pada pivot menjadi false
            $user->organizations()->syncWithoutDetaching([
                $organization['id'] => ['is_waiting' => false]
            ]);

        } else {
            //hapus relasi organization_user
            $user->organizations()->detach($organization['id']);
        }

        return redirect(route('organization'))->with('success', 'Organisasi Berhasil Ditautkan!');
    }

    public function shareToOtherDestroy(Request $request, Organization $organization): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|numeric',
            'organization_id' => 'required|string',
        ]);

        $authUser = Auth::user();

        $user = User::findOrFail($validated['user_id']);

        $user->organizations()->detach($organization['id']);

        if ($validated['user_id'] !== $authUser['id']) {
            return redirect(route('organization.share-to-other', $organization['id']));
        }

        return redirect(route('organization'))->with('success', 'Tautan Organisasi Berhasil Dihapus!');
    }
}
