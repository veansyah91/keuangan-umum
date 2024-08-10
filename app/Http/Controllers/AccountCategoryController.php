<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\AccountCategory;
use App\Models\Organization;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AccountCategoryController extends Controller
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
        $accountCategories = AccountCategory::filter(request(['search']))
            ->whereOrganizationId($organization['id'])
            ->orderBy('code')
            ->paginate(50)
            ->withQueryString();
        $user = Auth::user();

        return Inertia::render('AccountCategory/Index', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'accountCategories' => $accountCategories,
            'searchFilter' => request('search'),
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
                Rule::unique('account_categories')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                }),
            ],
            'code' => [
                'required',
                'string',
                'size:9',
                Rule::unique('account_categories')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                }),
            ],
        ]);

        if ($validator->fails()) {
            // Handle validation failure
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();

        $log = $validated;

        $validated['organization_id'] = $organization['id'];

        AccountCategory::create($validated);

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada KATEGORI AKUN dengan DATA : '.json_encode($log));

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization, AccountCategory $accountCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization, AccountCategory $accountCategory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization, AccountCategory $accountCategory)
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                Rule::unique('account_categories')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                })->ignore($accountCategory['id']),
            ],
            'code' => [
                'required',
                'string',
                'size:9',
                Rule::unique('account_categories')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                })->ignore($accountCategory['id']),
            ],
        ]);

        if ($validator->fails()) {
            // Handle validation failure
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $validated = $validator->validated();

        $log = $validated;

        $validated['organization_id'] = $organization['id'];

        $accountCategory->update($validated);

        $user = Auth::user();

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah mengubah DATA pada KATEGORI AKUN menjadi : '.json_encode($log));

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, AccountCategory $accountCategory)
    {
        // cek apakah telah digunakan pada tabel akun
        $account = Account::whereAccountCategoryId($accountCategory['id'])
            ->first();

        if ($account) {
            return redirect()->back()->withErrors(['account_used' => 'Tidak Dapat Dihapus, Kategori Akun Telah Digunakan Pada Akun'])->withInput();
        }

        $accountCategory->delete();

        return redirect()->back();
    }
}
