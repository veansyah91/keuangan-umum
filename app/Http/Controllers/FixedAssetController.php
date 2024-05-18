<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Ledger;
use App\Helpers\NewRef;
use App\Models\Account;
use App\Models\Journal;
use App\Models\FixedAsset;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\FixedAssetCategory;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use App\Repositories\Journal\JournalRepository;

class FixedAssetController extends Controller
{
    protected $userRepository;
    protected $logRepository;
    protected $journalRepository;
    protected $now;

    protected function createNewAccount($organizationId, $name, $newName, $accountCategory)
    {
        $firstAccount = Account::whereHas('accountCategory', function($query) use ($accountCategory) {
                                $query->where('name', 'like', '%' . $accountCategory . '%');
                            })
                            ->whereOrganizationId($organizationId)
                            ->where('name', 'like', '%' . $name . '%')
                            ->firstOrFail();

        $refCode = substr($firstAccount['code'],0,4);
        
        $account = Account::whereOrganizationId($organizationId)
                            ->where('code', 'like', $refCode . '%')
                            ->get()
                            ->last();

        return [
            "organization_id" => $organizationId,
            "account_category_id" => $account['account_category_id'],
            "name" => $newName,
            "code" => (int)$account['code'] + 1,
            "is_active" => 1,
            "is_cash" => 0,
            "can_be_deleted" => 1
        ];
    }

    public function __construct(UserRepository $userRepository, LogRepository $logRepository, JournalRepository $journalRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
        $this->journalRepository = $journalRepository;
        $this->now = CarbonImmutable::now();
    }

    protected function newRef($organization, $dateRequest = '', $code)
    {
        $now = $this->now;
        $date = $dateRequest ?? $now->isoFormat('YYYY-MM-DD');
        $dateRef = Carbon::create($date);
        $refHeader = $code . $dateRef->isoFormat('YYYY') . $dateRef->isoFormat('MM');
        $newRef = $refHeader . '001';

        $fixedAsset = FixedAsset::whereOrganizationId($organization['id'])
                            ->where('code', 'like', $refHeader . '%')
                            ->orderBy('code')
                            ->get()
                            ->last();

        if ($fixedAsset) {
            $newRef = NewRef::create($code, $fixedAsset['code']);
        }

        return $newRef;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Organization $organization)
    {
        $user = Auth::user();

        $disposal = request('disposal') == "true" ? true : false;

        $fixedAssets = FixedAsset::filter(request(['search', 'start_date', 'end_date']))
                                ->whereOrganizationId($organization['id'])
                                ->where('is_disposed', $disposal)
                                ->orderBy('date', 'desc')
                                ->paginate(50);

        return Inertia::render('FixedAsset/Index', [
            'organization' => $organization,
            'fixedAssets' => $fixedAssets,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'disposal' => $disposal,
            'accounts' => Account::filter(request(['account']))
                                    ->whereIsActive(true)
                                    ->whereOrganizationId($organization['id'])
                                    ->select('id', 'name', 'code', 'is_cash')
                                    ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Organization $organization)
    {
        $user = Auth::user();

        return Inertia::render('FixedAsset/Create', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'newRef' => $this->newRef($organization, request('date'), "HT-"),
            'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
            'accounts' => Account::filter(request(['account']))
                                    ->whereIsActive(true)
                                    ->whereOrganizationId($organization['id'])
                                    ->select('id', 'name', 'code', 'is_cash')
                                    ->get(),
            'fixedAssetCategories' => FixedAssetCategory::filter(request(['search']))
                                                            ->whereOrganizationId($organization['id'])
                                                            ->select('id', 'name', 'lifetime')
                                                            ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Organization $organization)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'date' => [
                'required',
                'date',               
            ],
            'lifetime' => [
                'required',
                'numeric', 
                'min:0'              
            ],
            'name' => [
                'required',
                'string',  
                Rule::unique('fixed_assets')->where(function ($query) use ($request, $organization){
                    return $query->where('organization_id', $organization['id']);
                })              
            ],
            'code' => [
                'required',
                'string',  
                Rule::unique('fixed_assets')->where(function ($query) use ($request, $organization){
                    return $query->where('organization_id', $organization['id']);
                })               
            ],
            'residue' => [
                'required',
                'numeric', 
                'min:0'              
            ],
            'value' => [
                'required',
                'numeric', 
                'min:1000'              
            ],
            'depreciation_value' => [
                'required',
                'numeric', 
                'min:0'              
            ],
            'depreciation_accumulated' => [
                'required',
                'numeric', 
                'min:0'              
            ],
            'credit_account.id' => [
                'required',
                'exists:accounts,id'
            ],
            'credit_account.is_cash' => [
                'required',
                'boolean'
            ],
            'credit_account.code' => [
                'required',
                'string'
            ],
            'fixed_asset_category' => [
                'required',
                'exists:fixed_asset_categories,id'
            ],
        ]);

        // cek tanggal
        // jika tanggal lebih tinggi dari hari sekarang, maka kirimkan error\
        if ($validated['date'] > $this->now->isoFormat("YYYY-MM-DD")) {
            return redirect()->back()->withErrors(["date" => "Date Value is Unexpected!"]);
        }

        // Buat Akun
        $fixedAssetCategory = FixedAssetCategory::find($validated['fixed_asset_category']);

        // akun aset
        $asset = Account::create($this->createNewAccount($organization['id'], $fixedAssetCategory['name'], $validated['name'],'HARTA TETAP BERWUJUD'));

        // akun akumulasi penyusutan
        $depreciationAccumulation = $validated['lifetime'] > 0 ? Account::create($this->createNewAccount($organization['id'], $fixedAssetCategory['name'], 'AKUMULASI PENYUSUTAN ' . $validated['name'],'AKUMULASI PENYUSUTAN')) : null;


        // akun beban penyusutan
        $depreciationCost = $validated['lifetime'] > 0  ? Account::create($this->createNewAccount($organization['id'], $fixedAssetCategory['name'], 'BEBAN PENYUSUTAN ' . $validated['name'],'BEBAN PENYUSUTAN')) : null;

        // cari akumulasi penyusutan
        // hitung perbedaan bulan        
        $formatedMonths = Carbon::parse($validated['date']);

        // buat jurnal pengadaan harta tetap
        $validated['no_ref'] = $validated['code'];
        $validated['description'] = "PENGADAAN HARTA TETAP : " . $validated['name'];
        $validated['organization_id'] = $organization['id'];
        $validated['user_id'] = $user['id'];
        $validated['fixed_asset_category_id'] = $validated['fixed_asset_category'];
        $validated['asset'] = $asset['id'];
        $validated['accumulated_depreciation'] = $depreciationAccumulation ? $depreciationAccumulation['id'] : null;
        $validated['depreciation'] = $depreciationCost ? $depreciationCost['id'] : null;

        if ($formatedMonths->diffInMonths($this->now) > 0) {
            $validated['depreciation_accumulated'] = $formatedMonths->diffInMonths($this->now) < $validated['lifetime'] ? $validated['depreciation_value'] * $formatedMonths->diffInMonths($this->now) : $validated['value'];
        }

        $data = [
            'organization_id' => $validated['organization_id'],
            'user_id' => $validated['user_id'],
            'fixed_asset_category_id' => $validated['fixed_asset_category_id'],
            'asset' => $validated['asset'],
            'accumulated_depreciation' => $validated['accumulated_depreciation'],
            'depreciation' => $validated['depreciation'],
            'credit_account' => $validated['credit_account']['id'],
            'lifetime' => $validated['lifetime'],
            'name' => $validated['name'],
            'code' => $validated['code'],
            'residue' => $validated['residue'],
            'value' => $validated['value'],
            'depreciation_value' => $validated['depreciation_value'],
            'depreciation_accumulated' => $validated['depreciation_accumulated'],
            'date' => $validated['date'],
        ];

        FixedAsset::create($data);

        $validated['date'] = $this->now->isoFormat('YYYY-MM-DD');

        $validated['accounts'] = [
            [
                'id' => $asset['id'],
                'code' => $asset['code'],
                'debit' => $validated['value'],
                'credit' => 0,
                'is_cash' => 0,
            ],
        ];

        if ($validated['lifetime'] == 0) {
            array_push($validated['accounts'], 
            [
                'id' => $validated['credit_account']['id'],
                'code' => $validated['credit_account']['code'],
                'debit' => 0,
                'credit' =>  $validated['value'],
                'is_cash' => $validated['credit_account']['is_cash'],
            ]);
        }

        if ($depreciationAccumulation) {
            array_push($validated['accounts'], 
            [
                'id' => $validated['credit_account']['id'],
                'code' => $validated['credit_account']['code'],
                'debit' => 0,
                'credit' =>  $validated['depreciation_accumulated'] < $validated['value'] ? $validated['value'] - $validated['depreciation_accumulated'] : 0,
                'is_cash' => $validated['credit_account']['is_cash'],
            ],
            [
                'id' => $depreciationAccumulation['id'],
                'code' => $depreciationAccumulation['code'],
                'debit' => 0,
                'credit' => $validated['depreciation_accumulated'] < $validated['value'] ? $validated['depreciation_accumulated'] : $validated['value'],
                'is_cash' => 0,
            ]);
        }

        $this->journalRepository->store($validated);

        $log = [
            'name' => $validated['name'],
            'code' => $validated['code'],
            'value' => $validated['value'],
            'lifetime' => $validated['lifetime'],
            'date' => $validated['date'],
        ];  

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menambahkan DATA pada HARTA TETAP dengan DATA : ' . json_encode($log));

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization, FixedAsset $fixedAsset)
    {
        $user = Auth::user();     

        return Inertia::render('FixedAsset/Show', [
            'fixedAsset' => $fixedAsset,
            'createdBy' => User::find($fixedAsset['user_id']),
            'journal' => Journal::whereOrganizationId($organization['id'])
                                ->whereNoRef($fixedAsset['code'])
                                ->first(),
            'assetAccount' => Account::find($fixedAsset['asset']),
            'depreciationAccumulationAccount' => Account::find($fixedAsset['accumulated_depreciation']),
            'depreciationCostAccount' => Account::find($fixedAsset['depreciation']),
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
        ]); 
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization, FixedAsset $fixedAsset)
    {
        $user = Auth::user();

        // cek apakah role user yang mengakses adalah admin atau pengguna yang membuat data, jika bukan, maka redirect ke halaman awal
        $organizationUser = User::whereId($user['id'])
                                ->with('organizations', function ($query) use ($organization){
                                    $query->whereOrganizationId($organization['id']);
                                })
                                ->first();
        
        if ($user['id'] !== $fixedAsset['user_id'] && $organizationUser->organizations[0]->pivot->role !== 'admin') {
            return redirect(route('data-master.fixed-asset', $organization['id']))->with('error', 'Anda Tidak Memiliki Hak Akses');
        }

        //cari journal
        $ledger = Ledger::whereOrganizationId($organization['id'])
                            ->whereAccountId($fixedAsset['asset'])
                            ->orderBy('id')
                            ->first();

        $journal = Journal::find($ledger['journal_id']);

        // jika tahun, tidak dalam periode
        $year = $this->now->isoFormat('YYYY');
        $tempDateInput = Carbon::create($journal['date']);
        $yearInput = $tempDateInput->isoFormat('YYYY');

        // cek apakah jurnal berbeda tahun buku
        if ($yearInput !== $year) {
            return redirect(route('data-master.fixed-asset', $organization['id']))->with('error', 'Date Value is Unexpected!');
        }

        return Inertia::render('FixedAsset/Edit', [
            'organization' => $organization,
            'fixedAsset' => $fixedAsset,
            'creditAccount' => Account::find($fixedAsset['credit_account']),
            'fixedAssetCategory' => FixedAssetCategory::find($fixedAsset['fixed_asset_category_id']),
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'newRef' => $this->newRef($organization, request('date'), "HT-"),
            'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
            'accounts' => Account::filter(request(['account']))
                                    ->whereIsActive(true)
                                    ->whereOrganizationId($organization['id'])
                                    ->select('id', 'name', 'code', 'is_cash')
                                    ->get(),
            'fixedAssetCategories' => FixedAssetCategory::filter(request(['search']))
                                                            ->whereOrganizationId($organization['id'])
                                                            ->select('id', 'name', 'lifetime')
                                                            ->get(),
        ]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization, FixedAsset $fixedAsset)
    {
        $user = Auth::user();

        //cari journal
        $ledger = Ledger::whereOrganizationId($organization['id'])
                            ->whereAccountId($fixedAsset['asset'])
                            ->orderBy('id')
                            ->first();

        $journal = Journal::find($ledger['journal_id']);

        // jika tahun, tidak dalam periode
        $year = $this->now->isoFormat('YYYY');
        $tempDateInput = Carbon::create($journal['date']);
        $yearInput = $tempDateInput->isoFormat('YYYY');

        // cek apakah jurnal berbeda tahun buku
        if ($yearInput !== $year) {
            return redirect(route('data-master.fixed-asset', $organization['id']))->withErrors(["date" => "Date Value is Unexpected!"]);
        }

        // cek apakah role user yang mengakses adalah admin atau pengguna yang membuat data, jika bukan, maka redirect ke halaman awal
        $organizationUser = User::whereId($user['id'])
                                ->with('organizations', function ($query) use ($organization){
                                    $query->whereOrganizationId($organization['id']);
                                })
                                ->first();

        if ($user['id'] !== $fixedAsset['user_id'] && $organizationUser->organizations[0]->pivot->role !== 'admin') {
            return redirect(route('data-master.fixed-asset', $organization['id']))->with('error', 'Anda Tidak Memiliki Hak Akses');
        }

        $validated = $request->validate([
            'date' => [
                'required',
                'date',               
            ],
            'lifetime' => [
                'required',
                'numeric', 
                'min:0'              
            ],
            'name' => [
                'required',
                'string',  
                Rule::unique('fixed_assets')->where(function ($query) use ($request, $organization){
                    return $query->where('organization_id', $organization['id']);
                })->ignore($fixedAsset['id'])              
            ],
            'code' => [
                'required',
                'string',  
                Rule::unique('fixed_assets')->where(function ($query) use ($request, $organization){
                    return $query->where('organization_id', $organization['id']);
                })->ignore($fixedAsset['id'])               
            ],
            'residue' => [
                'required',
                'numeric', 
                'min:0'              
            ],
            'value' => [
                'required',
                'numeric', 
                'min:1000'              
            ],
            'depreciation_value' => [
                'required',
                'numeric', 
                'min:0'              
            ],
            'depreciation_accumulated' => [
                'required',
                'numeric', 
                'min:0'              
            ],
            'credit_account.id' => [
                'required',
                'exists:accounts,id'
            ],
            'credit_account.is_cash' => [
                'required',
                'boolean'
            ],
            'status' => [
                'required',
                'boolean'
            ],
            'credit_account.code' => [
                'required',
                'string'
            ],
            'fixed_asset_category' => [
                'required',
                'exists:fixed_asset_categories,id'
            ],
        ]);
        $validated['organization_id'] = $organization['id'];
        $validated['user_id'] = $user['id'];
        
        // cek tanggal
        // jika tanggal lebih tinggi dari hari sekarang, maka kirimkan error\
        if ($validated['date'] > $this->now->isoFormat("YYYY-MM-DD")) {
            return redirect()->back()->withErrors(["date" => "Date Value is Unexpected!"]);
        }

        // akun-akun
        // akun aset
        $assetAccount = Account::find($fixedAsset['asset']);
        $assetAccount->update([
            "name" => $validated['name']
        ]);

        // akun akumulasi penyusutan
        $depreciationAccumulationAccount = Account::find($fixedAsset['accumulated_depreciation']);

        // akun beban akumulasi
        $depreciationCostAccount = Account::find($fixedAsset['depreciation']);

        // jika lifetime fixed asset baru == 0, maka hapus akun fixed asset yang berkaitan dengan data fixed asset
        if ($validated['lifetime'] > 0) {
            $fixedAssetCategory = FixedAssetCategory::find($validated['fixed_asset_category']);
            // jika kategori fixed asset lama !== kategori fixed asset baru maka tidak perlu dilakukan pembaruan akun akun
            if ($validated['fixed_asset_category'] !== $fixedAsset['fixed_asset_category_id']) {
                $newDepreciationAccount = $this->createNewAccount($organization['id'], $fixedAssetCategory['name'], 'AKUMULASI PENYUSUTAN ' . $validated['name'],'AKUMULASI PENYUSUTAN');

                if ($depreciationAccumulationAccount) {
                    $depreciationAccumulationAccount->update([
                        "account_category_id" => $newDepreciationAccount['account_category_id'],
                        "name" => $newDepreciationAccount['name'],
                        "code" => $newDepreciationAccount['code'],
                    ]);
                }
                else {
                    $depreciationAccumulationAccount = Account::create($newDepreciationAccount);
                }

                $newDepreciationCodeAccount = $this->createNewAccount($organization['id'], $fixedAssetCategory['name'], 'BEBAN PENYUSUTAN ' . $validated['name'],'BEBAN PENYUSUTAN');

                if ($depreciationCostAccount) {
                    $depreciationCostAccount->update([
                        "account_category_id" => $newDepreciationCodeAccount['account_category_id'],
                        "name" => $newDepreciationCodeAccount['name'],
                        "code" => $newDepreciationCodeAccount['code'],
                    ]);
                }
                else {
                    $depreciationCostAccount = Account::create($newDepreciationCodeAccount);
                }

            } else {
                // akun akumulasi penyusutan
                if ($depreciationAccumulationAccount) {
                    $depreciationAccumulationAccount->update([
                        "name" => 'AKUMULASI PENYUSUTAN ' . $validated['name']
                    ]);
                } else {
                    $depreciationAccumulationAccount = Account::create($this->createNewAccount($organization['id'], $fixedAssetCategory['name'], 'AKUMULASI PENYUSUTAN ' . $validated['name'],'AKUMULASI PENYUSUTAN'));
                }

                // akun beban penyusutan
                
                if ($depreciationCostAccount) {
                    $depreciationCostAccount->update([
                        "name" => 'BEBAN PENYUSUTAN ' . $validated['name']
                    ]);
                } else {
                    $depreciationCostAccount = Account::create($this->createNewAccount($organization['id'], $fixedAssetCategory['name'], 'BEBAN PENYUSUTAN ' . $validated['name'],'BEBAN PENYUSUTAN'));
                }                
            }

            $validated['accumulated_depreciation'] = $depreciationAccumulationAccount['id'];
            $validated['depreciation'] = $depreciationCostAccount['id'];
        } else {
            $validated['accumulated_depreciation'] = null;
            $validated['depreciation'] = null;
        }

        // cari akumulasi penyusutan
        // hitung perbedaan bulan        
        $formatedMonths = Carbon::parse($validated['date']);

        $validated['no_ref'] = $validated['code'];
        $validated['description'] = "PENGADAAN HARTA TETAP : " . $validated['name'];

        if ($formatedMonths->diffInMonths($this->now) > 0) {
            $validated['depreciation_accumulated'] = $formatedMonths->diffInMonths($this->now) < $validated['lifetime'] ? $validated['depreciation_value'] * $formatedMonths->diffInMonths($this->now) : $validated['value'];
        }

        // update Fixed Asset
        $fixedAsset->update([
            'fixed_asset_category_id' => $validated['fixed_asset_category'],
            'accumulated_depreciation' => $validated['accumulated_depreciation'],
            'depreciation' => $validated['depreciation'],
            'credit_account' => $validated['credit_account']['id'],
            'lifetime' => $validated['lifetime'],
            'name' => $validated['name'],
            'code' => $validated['code'],
            'residue' => $validated['residue'],
            'value' => $validated['value'],
            'depreciation_value' => $validated['depreciation_value'],
            'depreciation_accumulated' => $validated['depreciation_accumulated'],
            'date' => $validated['date'],
            'status' => $validated['status']
        ]);

        if ($validated['lifetime'] == 0)
        {
            if ($depreciationAccumulationAccount) {
                $depreciationAccumulationAccount->delete();
            }
            if ($depreciationCostAccount) {
                $depreciationCostAccount->delete();
            }
        }

        $validated['date'] = $journal['date'];

        $validated['accounts'] = [
            [
                'id' => $assetAccount['id'],
                'code' => $assetAccount['code'],
                'debit' => $validated['value'],
                'credit' => 0,
                'is_cash' => 0,
            ],
        ];

        if ($validated['lifetime'] > 0) {
            array_push($validated['accounts'], 
            [
                'id' => $validated['credit_account']['id'],
                'code' => $validated['credit_account']['code'],
                'debit' => 0,
                'credit' =>  $validated['depreciation_accumulated'] < $validated['value'] ? $validated['value'] - $validated['depreciation_accumulated'] : 0,
                'is_cash' => $validated['credit_account']['is_cash'],
            ],
            [
                'id' => $depreciationAccumulationAccount['id'],
                'code' => $depreciationAccumulationAccount['code'],
                'debit' => 0,
                'credit' => $validated['depreciation_accumulated'] < $validated['value'] ? $validated['depreciation_accumulated'] : $validated['value'],
                'is_cash' => 0,
            ]);
        }

        $this->journalRepository->update($validated, $journal); 

        $log = [
            'name' => $validated['name'],
            'code' => $validated['code'],
            'value' => $validated['value'],
            'lifetime' => $validated['lifetime'],
            'date' => $validated['date'],
        ];  

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah mengubah DATA pada HARTA TETAP menjadi : ' . json_encode($log));

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, FixedAsset $fixedAsset)
    {
        $user = Auth::user();

        //cari journal
        $ledger = Ledger::whereOrganizationId($organization['id'])
                            ->whereAccountId($fixedAsset['asset'])
                            ->orderBy('id')
                            ->first();

        $journal = Journal::find($ledger['journal_id']);

        // jika tahun, tidak dalam periode
        $year = $this->now->isoFormat('YYYY');
        $tempDateInput = Carbon::create($journal['date']);
        $yearInput = $tempDateInput->isoFormat('YYYY');

        // cek apakah jurnal berbeda tahun buku
        if ($yearInput !== $year) {
            return redirect(route('data-master.fixed-asset', $organization['id']))->withErrors(["message" => "Date Value is Unexpected!"]);
        }

        // cek apakah role user yang mengakses adalah admin atau pengguna yang membuat data, jika bukan, maka redirect ke halaman awal
        $organizationUser = User::whereId($user['id'])
                                ->with('organizations', function ($query) use ($organization){
                                    $query->whereOrganizationId($organization['id']);
                                })
                                ->first();
        
        if ($user['id'] !== $fixedAsset['user_id'] && $organizationUser->organizations[0]->pivot->role !== 'admin') {
            return redirect(route('data-ledger.journal', $organization['id']))->withErrors(["message" => "Anda Tidak Memiliki Hak Akses"]);
        }   

        $journal->delete();

        // jika ada disposal
        if ($fixedAsset['disposal_journal_id']) {
            $disposalJournal = Journal::find($fixedAsset['disposal_journal_id']);
            $disposalJournal->delete();            
        }

        // accounts
        $assetAccount = Account::find($fixedAsset['asset']);
        $depreciationAccumulationAccount = Account::find($fixedAsset['accumulated_depreciation']);
        $depreciationAccount = Account::find($fixedAsset['depreciation']);

        $fixedAsset->delete();

        $assetAccount->delete();

        if ($depreciationAccumulationAccount) {
            $depreciationAccumulationAccount->delete();
        }

        if ($depreciationAccount) {
            $depreciationAccount->delete();
        }

        $log = [
            'name' => $fixedAsset['name'],
            'code' => $fixedAsset['code'],
            'value' => $fixedAsset['value'],
            'lifetime' => $fixedAsset['lifetime'],
            'date' => $fixedAsset['date'],
        ];  

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menghapus DATA pada HARTA TETAP, data : ' . json_encode($log));

        return redirect()->back();

    }

    public function disposal(Request $request, Organization $organization, FixedAsset $fixedAsset)
    {
        $user = Auth::user();

        $validated = $request->validate([ 
            'description' => "string|nullable",
        ]);

        // akun aset lalu kreditkan
        $debitAccount = Account::find($fixedAsset['asset']);

        $validated['accounts'] = [
            [
                'id' => $debitAccount['id'],
                'code' => $debitAccount['code'],
                'debit' => 0,
                'credit' =>  $fixedAsset['value'],
                'is_cash' => 0,
            ]
        ];

        if ($fixedAsset['lifetime'] == 0 || ($fixedAsset['value'] - $fixedAsset['depreciation_accumulated']) > 0) {
            if (!$request['debit_account']['id']) {
                return redirect()->back()->withErrors(["debit_account" => "Debit Account Required"]);
            }

            array_push($validated['accounts'], 
            // asset
            [
                'id' => $request['debit_account']['id'],
                'code' => $request['debit_account']['code'],
                'debit' => $fixedAsset['lifetime'] == 0 ? $fixedAsset['value'] : ($fixedAsset['value'] - $fixedAsset['depreciation_accumulated']),
                'credit' => 0,
                'is_cash' => 0,
            ]);
        }

        // akun penyusutan lalu debitkan
        $depreciationAccumulationAccount = Account::find($fixedAsset['accumulated_depreciation']);

        if ($fixedAsset['lifetime'] > 0) {
            array_push($validated['accounts'],
            [
                'id' => $depreciationAccumulationAccount['id'],
                'code' => $depreciationAccumulationAccount['code'],
                'debit' => $fixedAsset['depreciation_accumulated'],
                'credit' => 0,
                'is_cash' => 0,
            ], );
        }

        $validated['date'] = $this->now->isoFormat("YYYY-MM-DD");
        $validated['description'] = 'PELEPASAN HARTA TETAP: ' . $fixedAsset['name'];
        $validated['no_ref'] = $this->newRef($organization, $this->now->isoFormat("YYYY-MM-DD"), "DHT-");
        $validated['value'] = $fixedAsset['value'];
        $validated['organization_id'] = $organization['id'];
        $validated['user_id'] = $user['id'];

        $journal = $this->journalRepository->store($validated);

        $fixedAsset->update([
            'status' => false,
            'depreciation_accumulated' => $fixedAsset['lifetime'] ? $fixedAsset['value'] : $fixedAsset['depreciation_accumulated'],
            'is_disposed' => true,
            'disposal_date' => $validated['date'],
            'disposal_ref' => $validated['no_ref'],
            'disposal_description' => $validated['description'],
            'disposal_journal_id' => $journal['id'],
        ]);
        
        $log = [
            'name' => $fixedAsset['name'],
            'code' => $fixedAsset['code'],
            'value' => $fixedAsset['value'],
        ];  

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah melakukan DISPOISI HARTA TETAP, data : ' . json_encode($log));

        return redirect()->back();
    }
}
