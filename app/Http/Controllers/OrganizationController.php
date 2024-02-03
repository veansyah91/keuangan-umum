<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use App\Repositories\Village\VillageRepository;
use App\Repositories\Account\AccountRepositoryInterface;
use App\Repositories\AccountCategory\AccountCategoryRepositoryInterface;
use Illuminate\Validation\Rule;


class OrganizationController extends Controller
{
    protected $accountCategoriesDefault = [
        // Neraca
        // Aset Lancar
        [
            'code' => '110000',
            'name' => 'Kas dan Setara Kas',
        ],
        [
            'code' => '120000',
            'name' => 'Piutang',
        ],
        [
            'code' => '130000',
            'name' => 'Biaya Dibayar Dimuka',
        ],
        [
            'code' => '131000',
            'name' => 'Pajak Dibayar Dimuka',
        ],
        [
            'code' => '150000',
            'name' => 'Persediaan',
        ],
        //
        // Aset Tetap
        // Kode 16xxxx Digunakan jika Yayasan memiliki Lembaga di bawahnya
        [
            'code' => '160000',
            'name' => 'Investasi',
        ],
        [
            'code' => '170000',
            'name' => 'Harta Tetap Berwujud',
        ],
        [
            'code' => '171000',
            'name' => 'Akumulasi Penyusutan Harta Tetap Berwujud',
        ],
        //
        // Utang
        [
            'code' => '210000',
            'name' => 'Kewajiban',
        ],
        [
            'code' => '220000',
            'name' => 'Pendapatan Diterima Dimuka',
        ],
        [
            'code' => '230000',
            'name' => 'Tabungan',
        ],
        [
            'code' => '240000',
            'name' => 'Utang Pajak',
        ],
        //
        // Modal
        [
            'code' => '310000',
            'name' => 'Modal',
        ],
        [
            'code' => '320000',
            'name' => 'Laba',
        ],
        //
        // Pendapatan
        [
            'code' => '410000',
            'name' => 'Pendapatan Dari Donatur Tetap',
        ],
        [
            'code' => '420000',
            'name' => 'Pendapatan Dari Sumbangan',
        ],
        //
        // Pengeluaran Variabel
        [
            'code' => '510000',
            'name' => 'Akomodasi Ustad',
        ],
        [
            'code' => '520000',
            'name' => 'Pengeluaran Rapat',
        ],
        //
        // Pengeluaran Tetap
        [
            'code' => '610000',
            'name' => 'Beban Operasional',
        ],
        [
            'code' => '620000',
            'name' => 'Beban Administrasi Dan Umum',
        ],
        //
        // Beban Penyusutan
        [
            'code' => '710000',
            'name' => 'Beban Penyusutan',
        ],
        //
    ];

    protected $accountsDefault = [
        [
            'category_name' => 'Kas dan Setara Kas',
            'code' => '111000',
            'name' => 'Kas',
            'is_cash' => true,
        ],
        [
            'category_name' => 'Kas dan Setara Kas',
            'code' => '112000',
            'name' => 'Bank',
            'is_cash' => true,
        ],
        [
            'category_name' => 'Piutang',
            'code' => '120000',
            'name' => 'Piutang',
        ],
        [
            'category_name' => 'Biaya Dibayar Dimuka',
            'code' => '130000',
            'name' => 'Biaya Dibayar Dimuka',
        ],
        [
            'category_name' => 'Pajak Dibayar Dimuka',
            'code' => '131000',
            'name' => 'Pajak Dibayar Dimuka',
        ],
        [
            'category_name' => 'Persediaan',
            'code' => '150000',
            'name' => 'Persediaan',
        ],
        [
            'category_name' => 'Investasi',
            'code' => '160000',
            'name' => 'Investasi',
        ],
        [
            'category_name' => 'Harta Tetap Berwujud',
            'code' => '170000',
            'name' => 'Tanah',
        ],
        [
            'category_name' => 'Harta Tetap Berwujud',
            'code' => '170100',
            'name' => 'Bangunan',
        ],
        [
            'category_name' => 'Harta Tetap Berwujud',
            'code' => '171100',
            'name' => 'Akumulasi Penyusutan Bangunan',
        ],
        [
            'category_name' => 'Harta Tetap Berwujud',
            'code' => '170200',
            'name' => 'Kendaraan',
        ],
        [
            'category_name' => 'Harta Tetap Berwujud',
            'code' => '171200',
            'name' => 'Akumulasi Penyusutan Kendaraan',
        ],
        [
            'category_name' => 'Harta Tetap Berwujud',
            'code' => '170300',
            'name' => 'Peralatan',
        ],
        [
            'category_name' => 'Harta Tetap Berwujud',
            'code' => '171300',
            'name' => 'Akumulasi Penyusutan Peralatan',
        ],
        [
            'category_name' => 'Kewajiban',
            'code' => '210000',
            'name' => 'Kewajiban',
        ],
        [
            'category_name' => 'Pendapatan Diterima Dimuka',
            'code' => '220000',
            'name' => 'Pendapatan Diterima Dimuka',
        ],
        [
            'category_name' => 'Utang Pajak',
            'code' => '230000',
            'name' => 'Utang Pajak',
        ],
        [
            'category_name' => 'Tabungan',
            'code' => '230000',
            'name' => 'Tabungan',
        ],
        [
            'category_name' => 'Modal',
            'code' => '310000',
            'name' => 'Modal',
        ],
        [
            'category_name' => 'Laba',
            'code' => '320000',
            'name' => 'Modal',
        ],
        [
            'category_name' => 'Pendapatan Dari Donatur Tetap',
            'code' => '410000',
            'name' => 'Pendapatan Dari Donatur Tetap',
        ],
        [
            'category_name' => 'Pendapatan Dari Donatur Tetap',
            'code' => '420000',
            'name' => 'Pendapatan Dari Sumbangan',
        ],
        [
            'category_name' => 'Akomodasi Ustad',
            'code' => '510000',
            'name' => 'Akomodasi Ustad',
        ],
        [
            'category_name' => 'Pengeluaran Rapat',
            'code' => '520000',
            'name' => 'Pengeluaran Rapat',
        ],
        [
            'category_name' => 'Beban Operasional',
            'code' => '610000',
            'name' => 'Beban Operasional',
        ],
        [
            'category_name' => 'Beban Operasional',
            'code' => '610001',
            'name' => 'Beban Listrik',
        ],
        [
            'category_name' => 'Beban Operasional',
            'code' => '610001',
            'name' => 'Beban Air',
        ],
        [
            'category_name' => 'Beban Administrasi Dan Umum',
            'code' => '620000',
            'name' => 'Beban Gaji',
        ],
        [
            'category_name' => 'Beban Penyusutan',
            'code' => '711000',
            'name' => 'Beban Penyusutan Bangunan',
        ],
        [
            'category_name' => 'Beban Penyusutan',
            'code' => '712000',
            'name' => 'Beban Penyusutan Kendaraan',
        ],
        [
            'category_name' => 'Beban Penyusutan',
            'code' => '713000',
            'name' => 'Beban Penyusutan Peralatan',
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
            'name' => 'required|string|max:255',
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

                return $accountCategory->account()->create($account);
            });
        });
        //

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
            'name' => 'required|string|max:255',
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
