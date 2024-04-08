<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Ledger;
use App\Helpers\NewRef;
use App\Models\Account;
use App\Models\Journal;
use App\Models\Program;
use App\Models\Project;
use App\Models\Cashflow;
use App\Models\Department;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use Illuminate\Support\Facades\Validator;
use App\Repositories\Journal\JournalRepository;


class JournalController extends Controller
{
    protected $userRepository;
    protected $logRepository;
    protected $journalRepository;
    protected $now;

    public function __construct(UserRepository $userRepository, LogRepository $logRepository, JournalRepository $journalRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
        $this->journalRepository = $journalRepository;
        $this->now = CarbonImmutable::now();
    }

    protected function newRef($organization, $dateRequest = '')
    {
        $now = $this->now;
        $date = $dateRequest ?? $now->isoFormat('YYYY-MM-DD');
        $dateRef = Carbon::create($date);
        $refHeader = "JU-" . $dateRef->isoFormat('YYYY') . $dateRef->isoFormat('MM');
        $newRef = $refHeader . '001';

        $journal = Journal::whereOrganizationId($organization['id'])
                            ->where('no_ref', 'like', $refHeader . '%')
                            ->orderBy('no_ref')
                            ->get()
                            ->last();

        if ($journal) {
            $newRef = NewRef::create("JU-", $journal['no_ref']);
        }

        return $newRef;
    }
    
    public function index(Organization $organization)
    {
        $journals = Journal::filter(request(['search', 'start_date', 'end_date', 'is_approved', 'program', 'project', 'department']))
                            ->whereOrganizationId($organization['id'])
                            ->orderBy('date', 'desc')
                            ->orderBy('no_ref', 'desc')
                            ->paginate(50);

        $user = Auth::user();

        return Inertia::render('Journal/Index', [
            'startDate' => request('start_date'),
            'endDate' => request('end_date'),
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'journals' => $journals,
            'isApproved' => request('is_approved') == "true" ? true : false,
            'projects' => Project::whereOrganizationId($organization['id'])
                                    ->select('id', 'name', 'code')
                                    ->get(),
            'programs' => Program::whereIsActive(true)
                                    ->whereOrganizationId($organization['id'])
                                    ->select('id', 'name', 'code')
                                    ->get(), 
            'departments' => Department::whereIsActive(true)
                                        ->whereOrganizationId($organization['id'])
                                        ->select('id', 'name', 'code')
                                        ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Organization $organization)
    {
        $user = Auth::user();                     

        return Inertia::render('Journal/Create', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'newRef' => $this->newRef($organization, request('date')),
            'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
            'accounts' => Account::filter(request(['search']))
                                    ->whereIsActive(true)
                                    ->whereOrganizationId($organization['id'])
                                    ->select('id', 'name', 'code', 'is_cash')
                                    ->get(),
            'projects' => Project::whereOrganizationId($organization['id'])
                                    ->select('id', 'name', 'code')
                                    ->get(),
            'programs' => Program::whereIsActive(true)
                                    ->whereOrganizationId($organization['id'])
                                    ->select('id', 'name', 'code')
                                    ->get(), 
            'departments' => Department::whereIsActive(true)
                                        ->whereOrganizationId($organization['id'])
                                        ->select('id', 'name', 'code')
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
            'description' => [
                'required',
                'string',               
            ],
            'no_ref' => [
                'required',
                'string', 
                Rule::unique('journals')->where(function ($query) use ($request, $organization){
                    return $query->where('organization_id', $organization['id']);
                })               
            ],
            'accounts' => [
                'required',
            ],
            'accounts.*.id' => [
                'required',
                'exists:accounts,id'
            ],
            'accounts.*.debit' => [
                'required',
                'numeric',
                'min:0'
            ],
            'accounts.*.credit' => [
                'required',
                'numeric',
                'min:0'
            ],
            'accounts.*.is_cash' => [
                'required',
                'boolean'
            ],
            'is_approved' => [
                'required',
                'boolean'
            ],
            'department_id' => [
                'nullable',
            ],
            'program_id' => [
                'nullable',
            ],
            'project_id' => [
                'nullable',
            ],
        ]);

        // cek balancing debit dan kredit
        $totalDebit = 0;
        $totalCredit = 0;

        // cek tanggal
        // jika tanggal lebih tinggi dari hari sekarang, maka kirimkan error\
        if ($validated['date'] > $this->now->isoFormat("YYYY-MM-DD")) {
            return redirect()->back()->withErrors(["date" => "Date Value is Unexpected!"]);
        }

        // jika tahun, tidak dalam peride
        $year = $this->now->isoFormat('YYYY');
        $tempDateInput = Carbon::create($validated['date']);
        $yearInput = $tempDateInput->isoFormat('YYYY');

        if ($yearInput !== $year) {
             return redirect()->back()->withErrors(["date" => "Date Value is Unexpected!"]);        
        }

        foreach ($validated['accounts'] as $value) {
            $totalDebit += $value['debit'];
            $totalCredit += $value['credit'];
        }

        if ($totalDebit + $totalCredit == 0) {
            return redirect()->back()->withErrors(['empty' => 'Debit And Credit is required']);
        }

        if ($totalDebit - $totalCredit !== 0) {
            return redirect()->back()->withErrors(['balance'=>'Not Balances']);
        }

        $validated['value'] = $totalDebit;
        $validated['is_direct'] = true;
        $validated['organization_id'] = $organization['id'];
        $validated['user_id'] = $user['id'];

        $log = [
            'description' => $validated['description'],
            'date' => $validated['date'],
            'no_ref' => $validated['no_ref'],
            'value' => $totalDebit
        ];

        $this->journalRepository->store($validated);

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menambahkan DATA pada JURNAL dengan DATA : ' . json_encode($log));

        return redirect(route('data-ledger.journal.create', $organization['id']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization, Journal $journal)
    {
        $user = Auth::user();     
        $journalUser = $journal->user()->get();

        return Inertia::render('Journal/Show', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'journal' => $journal,
            'journalUser' => $journalUser,
            'ledgers' => Ledger::whereJournalId($journal['id'])->with('account')->get(),
            'program' => Program::find($journal['program_id']),
            'project' => Project::find($journal['project_id']),
            'department' => Department::find($journal['department_id']),
        ]);
    }
 
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization, Journal $journal)
    {
        $user = Auth::user();     
        
        // cek apakah role user yang mengakses adalah admin atau pengguna yang membuat data, jika bukan, maka redirect ke halaman awal
        $organizationUser = User::whereId($user['id'])
                                ->with('organizations', function ($query) use ($organization){
                                    $query->whereOrganizationId($organization['id']);
                                })
                                ->first();
        
        if ($user['id'] !== $journal['user_id'] && $organizationUser->organizations[0]->pivot->role !== 'admin') {
            return redirect(route('data-ledger.journal', $organization['id']))->with('error', 'Anda Tidak Memiliki Hak Akses');
        }

        if (!$journal['is_direct']) {
            return redirect(route('data-ledger.journal', $organization['id']))->with('error', 'Tidak Bisa Diedit Di Journal');
        }

        $accounts = Account::filter(request(['search']))
                            ->whereIsActive(true)
                            ->whereOrganizationId($organization['id'])
                            ->select('id', 'name', 'code', 'is_cash')
                            ->get();               

        $now = Carbon::now();
        $date = request('date') ?? $journal['date'];

        return Inertia::render('Journal/Edit',[
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'newRef' => $this->newRef($organization, request('date')),
            'date' => $date,
            'accounts' => $accounts,
            'journal' => $journal,
            'ledgers' => Ledger::whereJournalId($journal['id'])->with('account')->orderBy('credit', 'asc')->get(),
            'program' => Program::find($journal['program_id']),
            'project' => Project::find($journal['project_id']),
            'department' => Department::find($journal['department_id']),
            'projects' => Project::whereOrganizationId($organization['id'])
                                    ->select('id', 'name', 'code')
                                    ->get(),
            'programs' => Program::whereIsActive(true)
                                    ->whereOrganizationId($organization['id'])
                                    ->select('id', 'name', 'code')
                                    ->get(), 
            'departments' => Department::whereIsActive(true)
                                        ->whereOrganizationId($organization['id'])
                                        ->select('id', 'name', 'code')
                                        ->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization, Journal $journal)
    {
        $user = Auth::user();

        // cek apakah role user yang mengakses adalah admin atau pengguna yang membuat data, jika bukan, maka redirect ke halaman awal
        $organizationUser = User::whereId($user['id'])
                                ->with('organizations', function ($query) use ($organization){
                                    $query->whereOrganizationId($organization['id']);
                                })
                                ->first();
        
        if ($user['id'] !== $journal['user_id'] && $organizationUser->organizations[0]->pivot->role !== 'admin') {
            return redirect(route('data-ledger.journal', $organization['id']))->with('error', 'Anda Tidak Memiliki Hak Akses');
        }

        if (!$journal['is_direct']) {
            return redirect(route('data-ledger.journal', $organization['id']))->with('error', 'Tidak Bisa Diedit Di Journal');
        }

        $validated = $request->validate([
            'date' => [
                'required',
                'date',               
            ],
            'description' => [
                'required',
                'string',               
            ],
            'no_ref' => [
                'required',
                'string', 
                Rule::unique('journals')->where(function ($query) use ($request, $organization){
                    return $query->where('organization_id', $organization['id']);
                })->ignore($journal['id'])               
            ],
            'accounts' => [
                'required',
            ],
            'accounts.*.id' => [
                'required',
                'exists:accounts,id'
            ],
            'accounts.*.debit' => [
                'required',
                'numeric',
                'min:0'
            ],
            'accounts.*.credit' => [
                'required',
                'numeric',
                'min:0'
            ],
            'accounts.*.is_cash' => [
                'required',
                'boolean'
            ],
            'is_approved' => [
                'required',
                'boolean'
            ],            
            'department_id' => [
                'nullable',
            ],
            'program_id' => [
                'nullable',
            ],
            'project_id' => [
                'nullable',
            ],
        ]);

        // cek tanggal
        // jika tanggal lebih tinggi dari hari sekarang, maka kirimkan error\
        if (($validated['date'] > $this->now->isoFormat("YYYY-MM-DD")) || ($journal['date'] > $this->now->isoFormat("YYYY-MM-DD"))) {
            
            return redirect()->back()->withErrors(["date" => "Date Value is Unexpected!"]);
        }

        // jika tahun, tidak dalam peride
        $year = $this->now->isoFormat('YYYY');
        $tempDateInput = Carbon::create($validated['date']);
        $yearInput = $tempDateInput->isoFormat('YYYY');

        if ($yearInput !== $year) {
             return redirect()->back()->withErrors(["date" => "Date Value is Unexpected!"]);        
        }

        // cek balancing debit dan kredit
        $totalDebit = 0;
        $totalCredit = 0;

        foreach ($validated['accounts'] as $value) {
            $totalDebit += $value['debit'];
            $totalCredit += $value['credit'];
        }

        if ($totalDebit + $totalCredit == 0) {
            return redirect()->back()->withErrors(['empty' => 'Debit And Credit is required']);
        }

        if ($totalDebit - $totalCredit !== 0) {
            return redirect()->back()->withErrors(['balance'=>'Not Balances']);
        }

        $validated['value'] = $totalDebit;
        $validated['organization_id'] = $organization['id'];
        $validated['user_id'] = $user['id'];

        $log = [
            'description' => $validated['description'],
            'date' => $validated['date'],
            'no_ref' => $validated['no_ref'],
            'value' => $totalDebit
        ];

        $this->journalRepository->update($validated, $journal);      
        
        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah mengubah DATA pada JURNAL menjadi : ' . json_encode($log));

        return redirect(route('data-ledger.journal.edit', ['organization' => $organization['id'], 'journal' => $journal]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, Journal $journal)
    {
        $user = Auth::user();

        if (!$journal['is_direct']) {
            return redirect(route('data-ledger.journal', $organization['id']))->withErrors(['isNotDirect' => 'Tidak Bisa Dihapus Di Journal']);
        }
        // cek tanggal
        // jika tanggal lebih tinggi dari hari sekarang, maka kirimkan error\
        if ($journal['date'] > $this->now->isoFormat("YYYY-MM-DD")) {
            return redirect()->back()->withErrors(["date" => "Date Value is Unexpected!"]);
        }

        // jika tahun, tidak dalam peride
        $year = $this->now->isoFormat('YYYY');
        $tempDateInput = Carbon::create($journal['date']);
        $yearInput = $tempDateInput->isoFormat('YYYY');

        if ($yearInput !== $year) {
             return redirect()->back()->withErrors(["date" => "Date Value is Unexpected!"]);        
        }

        // cek apakah role user yang mengakses adalah admin atau pengguna yang membuat data, jika bukan, maka redirect ke halaman awal
        $organizationUser = User::whereId($user['id'])
                                ->with('organizations', function ($query) use ($organization){
                                    $query->whereOrganizationId($organization['id']);
                                })
                                ->first();
        
        if ($user['id'] !== $journal['user_id'] && $organizationUser->organizations[0]->pivot->role !== 'admin') {
            return redirect(route('data-ledger.journal', $organization['id']))->with('error', 'Anda Tidak Memiliki Hak Akses');
        }       
        
        $journal->delete();

        $log = [
            'description' => $journal['description'],
            'date' => $journal['date'],
            'no_ref' => $journal['no_ref'],
            'value' => $journal['value']
        ];

        $this->logRepository->store($organization['id'], strtoupper($user['name']) . ' telah menghapus DATA pada JURNAL, yaitu DATA : ' . json_encode($log));

        return redirect()->back();
    }
}
