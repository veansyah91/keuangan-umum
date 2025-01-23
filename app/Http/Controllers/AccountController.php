<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Ledger;
use App\Models\Account;
use App\Models\Organization;
use Illuminate\Http\Request;
use App\Models\AccountCategory;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    protected $userRepository;

    protected $logRepository;

    public function __construct(UserRepository $userRepository, LogRepository $logRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Organization $organization)
    {
        $accountCategories = AccountCategory::filter(request(['accountCategoryFilter']))
            ->whereOrganizationId($organization['id'])
            ->orderBy('code')
            ->select('id', 'code', 'name')
            ->get();

        $code = 0;

        if (request('selectedAccountCategory')) {
            $accountCategory = AccountCategory::findOrFail(request('selectedAccountCategory'));
            $account = Account::whereAccountCategoryId(request('selectedAccountCategory'))
                ->orderBy('code')
                ->latest()
                ->first();
            $code = $account ? (int) $account['code'] + 1 : (int) $accountCategory['code'];
        }

        $search = request('search');
        // dd($search);

        $accounts = Account::filter(request(['search']))
            ->whereOrganizationId($organization['id'])
                            // ->whereHas('accountCategory', function ($query) use ($search){
                            //     $query->where('name', 'like', '%'.$search.'%');
                            // })
            ->with('accountCategory')
            ->orderBy('code')
            ->paginate(50)->withQueryString();

        $user = Auth::user();

        return Inertia::render('Account/Index', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'accounts' => $accounts,
            'accountCategories' => $accountCategories,
            'accountCategoryFilter' => request('accountCategoryFilter'),
            'searchFilter' => request('search'),
            'selectedAccountCategoryFilter' => request('selectedAccountCategory'),
            'code' => $code,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Organization $organization)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Organization $organization)
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                Rule::unique('accounts')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                }),
            ],
            'code' => [
                'required',
                'string',
                'size:9',
                Rule::unique('accounts')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                }),
            ],
            'account_category_id' => [
                'required',
                'exists:account_categories,id',
            ],
            'is_cash' => [
                'required',
                'boolean',
            ],
        ]);

        $validated = $validator->validated();
        $log = $validated;

        $validated['organization_id'] = $organization['id'];

        DB::transaction(function() use ($validated, $organization, $log){
            Account::create($validated);
            $user = Auth::user();

            $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada AKUN dengan DATA : '.json_encode($log));
        });

        return redirect(route('data-ledger.account', $organization['id']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization, Account $account)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization, Account $account)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization, Account $account)
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                Rule::unique('accounts')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                })->ignore($account['id']),
            ],
            'code' => [
                'required',
                'string',
                'size:9',
                Rule::unique('accounts')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                })->ignore($account['id']),
            ],
            'account_category_id' => [
                'required',
                'exists:account_categories,id',
            ],
            'is_cash' => [
                'required',
                'boolean',
            ],
            'is_active' => [
                'required',
                'boolean',
            ],
        ]);

        $validated = $validator->validated();

        DB::transaction(function() use ($validated, $organization, $account){
            $account->update($validated);

            $user = Auth::user();
    
            $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada AKUN menjadi : '.json_encode($validated));
        });
        

        return redirect(route('data-ledger.account', $organization['id']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, Account $account)
    {
        // cek can be deleted
        if (! $account['can_be_deleted']) {
            return redirect()->back()->withErrors(['used' => 'Tidak Dapat Dihapus, Akun Telah Digunakan']);
        }

        // cek di buku besar, apakah akun pernah digunakan
        $ledger = Ledger::whereAccountId($account['id'])
            ->first();

        if ($ledger) {
            return redirect()->back()->withErrors(['used' => 'Tidak Dapat Dihapus, Akun Telah Digunakan']);
        }

        $account->delete();

        $data = [
            'id' => $account['id'],
            'name' => $account['name'],
            'code' => $account['code']
        ];

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menghapus DATA pada AKUN, Data : '.json_encode($data));

        return redirect(route('data-ledger.account', $organization['id']));
    }
}
