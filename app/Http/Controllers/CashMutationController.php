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
use App\Models\Department;
use Carbon\CarbonImmutable;
use App\Models\CashMutation;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use App\Repositories\Account\AccountRepository;
use App\Repositories\Journal\JournalRepository;
use App\Repositories\Program\ProgramRepository;
use App\Repositories\Project\ProjectRepository;
use App\Repositories\Department\DepartmentRepository;

class CashMutationController extends Controller
{
    protected $userRepository;
    protected $logRepository;
    protected $journalRepository;
    protected $accountRepository;
    protected $programRepository;
    protected $projectRepository;
    protected $departmentRepository;
    protected $now;

    public function __construct(UserRepository $userRepository, LogRepository $logRepository, JournalRepository $journalRepository, AccountRepository $accountRepository, ProgramRepository $programRepository, ProjectRepository $projectRepository, DepartmentRepository $departmentRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
        $this->journalRepository = $journalRepository;
        $this->accountRepository = $accountRepository;
        $this->programRepository = $programRepository;
        $this->projectRepository = $projectRepository;
        $this->departmentRepository = $departmentRepository;
        $this->now = CarbonImmutable::now();
    }

    protected function newRef($organization, $dateRequest = '')
    {
        $now = $this->now;
        $date = $dateRequest ?? $now->isoFormat('YYYY-MM-DD');
        $dateRef = Carbon::create($date);
        $refHeader = 'MK-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
        $newRef = $refHeader.'001';

        $cashMutation = CashMutation::whereOrganizationId($organization['id'])
            ->where('no_ref', 'like', $refHeader.'%')
            ->orderBy('no_ref')
            ->get()
            ->last();

        if ($cashMutation) {
            $newRef = NewRef::create('MK-', $cashMutation['no_ref']);
        }

        return $newRef;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Organization $organization)
    {
        $user = Auth::user();

        $cashMutations = CashMutation::filter(request(['search', 'start_date', 'end_date', 'is_approved', 'program', 'project', 'department']))
            ->whereOrganizationId($organization['id'])
            ->with('journal')
            ->orderBy('date', 'desc')
            ->orderBy('no_ref', 'desc')
            ->paginate(50);

        return Inertia::render('CashMutation/Index', [
            'startDate' => request('start_date'),
            'endDate' => request('end_date'),
            'organization' => $organization,
            'cashMutations' => $cashMutations,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'isApproved' => request('is_approved') == 'true' ? true : false,
            'programs' => $this->programRepository->getData($organization['id']),
            'projects' => $this->projectRepository->getData($organization['id']),
            'departments' => $this->departmentRepository->getData($organization['id']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Organization $organization)
    {
        $user = Auth::user();

        return Inertia::render('CashMutation/Create', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'newRef' => $this->newRef($organization, request('date')),
            'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
            'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),
            'programs' => $this->programRepository->getData($organization['id']),
            'projects' => $this->projectRepository->getData($organization['id']),
            'departments' => $this->departmentRepository->getData($organization['id']),
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
                Rule::unique('cash_mutations')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                }),
            ],
            'accountDebit' => [
                'required',
                'exists:accounts,id',
            ],
            'accountCredit' => [
                'required',
                'exists:accounts,id',
            ],
            'value' => [
                'required',
                'numeric',
                'min:1',
            ],
            'is_approved' => [
                'required',
                'boolean',
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
        if ($validated['date'] > $this->now->isoFormat('YYYY-MM-DD')) {
            return redirect()->back()->withErrors(['date' => 'Date Value is Unexpected!']);
        }

        // jika tahun, tidak dalam peride
        $year = $this->now->isoFormat('YYYY');
        $tempDateInput = Carbon::create($validated['date']);
        $yearInput = $tempDateInput->isoFormat('YYYY');

        if ($yearInput !== $year) {
            return redirect()->back()->withErrors(['date' => 'Date Value is Unexpected!']);
        }

        // siapkan variabel akun untuk buku besar
        $validated['accounts'][0] = [
            'id' => $validated['accountDebit'],
            'name' => '',
            'code' => '',
            'is_cash' => 1,
            'debit' => $validated['value'],
            'credit' => 0,
        ];
        $validated['accounts'][1] = [
            'id' => $validated['accountCredit'],
            'name' => '',
            'code' => '',
            'is_cash' => 1,
            'debit' => 0,
            'credit' => $validated['value'],
        ];

        $validated['organization_id'] = $organization['id'];
        $validated['user_id'] = $user['id'];

        $journal = $this->journalRepository->store($validated);
        $validated['journal_id'] = $journal['id'];

        $log = [
            'description' => $validated['description'],
            'date' => $validated['date'],
            'no_ref' => $validated['no_ref'],
            'value' => $validated['value'],
        ];

        CashMutation::create($validated);

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada MUTASI KAS dengan DATA : '.json_encode($log));

        return redirect(route('cashflow.cash-mutation.create', $organization['id']));

    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization, CashMutation $cashMutation)
    {
        $user = Auth::user();

        $journal = Journal::find($cashMutation['journal_id']);
        $journalUser = $journal->user()->get();

        return Inertia::render('CashMutation/Show', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'cashMutation' => $cashMutation,
            'journal' => $journal,
            'journalUser' => $journalUser,
            'ledgers' => Ledger::whereJournalId($journal['id'])->with('account')->orderBy('credit')->get(),
            'program' => Program::find($journal['program_id']),
            'project' => Project::find($journal['project_id']),
            'department' => Department::find($journal['department_id']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Organization $organization, CashMutation $cashMutation)
    {
        $user = Auth::user();

        $ledgers = $cashMutation->journal->ledgers;

        foreach ($ledgers as $ledger) {
            if ($ledger['debit'] > 0) {
                $cashMutation['accountDebit'] = [
                    'id' => $ledger->account['id'],
                    'code' => $ledger->account['code'],
                    'name' => $ledger->account['name'],
                ];
            }
            if ($ledger['credit'] > 0) {
                $cashMutation['accountCredit'] = [
                    'id' => $ledger->account['id'],
                    'code' => $ledger->account['code'],
                    'name' => $ledger->account['name'],
                ];
            }
        }
        $cashMutation->journal->is_approved;
        $cashMutation->journal->program;
        $cashMutation->journal->project;
        $cashMutation->journal->department;

        // dd($cashMutation);
        return Inertia::render('CashMutation/Edit', [
            'cashMutation' => $cashMutation,
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'newRef' => $this->newRef($organization, request('date')),
            'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
            'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),
            'programs' => $this->programRepository->getData($organization['id']),
            'projects' => $this->projectRepository->getData($organization['id']),
            'departments' => $this->departmentRepository->getData($organization['id']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization, CashMutation $cashMutation)
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
                Rule::unique('cash_mutations')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                })->ignore($cashMutation['id']),
            ],
            'accountDebit' => [
                'required',
                'exists:accounts,id',
            ],
            'accountCredit' => [
                'required',
                'exists:accounts,id',
            ],
            'value' => [
                'required',
                'numeric',
                'min:1',
            ],
            'is_approved' => [
                'required',
                'boolean',
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

        // cek apakah role user yang mengakses adalah admin atau pengguna yang membuat data, jika bukan, maka redirect ke halaman awal
        $organizationUser = User::whereId($user['id'])
            ->with('organizations', function ($query) use ($organization) {
                $query->whereOrganizationId($organization['id']);
            })
            ->first();

        if ($user['id'] !== $cashMutation['created_by_id'] && $organizationUser->organizations[0]->pivot->role !== 'admin') {
            return redirect(route('cashflow.journal', $organization['id']))->with('error', 'Anda Tidak Memiliki Hak Akses');
        }

        // cek tanggal
        // jika tanggal lebih tinggi dari hari sekarang, maka kirimkan error\
        if ($validated['date'] > $this->now->isoFormat('YYYY-MM-DD')) {
            return redirect()->back()->withErrors(['date' => 'Date Value is Unexpected!']);
        }

        // jika tahun, tidak dalam peride
        $year = $this->now->isoFormat('YYYY');
        $tempDateInput = Carbon::create($validated['date']);
        $yearInput = $tempDateInput->isoFormat('YYYY');

        if ($yearInput !== $year) {
            return redirect()->back()->withErrors(['date' => 'Date Value is Unexpected!']);
        }

        // siapkan variabel akun untuk buku besar
        $validated['accounts'][0] = [
            'id' => $validated['accountDebit'],
            'name' => '',
            'code' => '',
            'is_cash' => 1,
            'debit' => $validated['value'],
            'credit' => 0,
        ];
        $validated['accounts'][1] = [
            'id' => $validated['accountCredit'],
            'name' => '',
            'code' => '',
            'is_cash' => 1,
            'debit' => 0,
            'credit' => $validated['value'],
        ];

        $validated['organization_id'] = $organization['id'];
        $validated['user_id'] = $user['id'];

        $cashMutation->update($validated);

        $this->journalRepository->update($validated, $cashMutation->journal);

        $log = [
            'description' => $validated['description'],
            'date' => $validated['date'],
            'no_ref' => $validated['no_ref'],
            'value' => $validated['value'],
        ];

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah mengubah DATA pada MUTASI KAS dengan DATA : '.json_encode($log));

        return redirect(route('cashflow.cash-mutation.edit', ['organization' => $organization['id'], 'cashMutation' => $cashMutation]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, CashMutation $cashMutation)
    {
        $user = Auth::user();

        // cek tanggal
        // jika tanggal lebih tinggi dari hari sekarang, maka kirimkan error\
        if ($cashMutation['date'] > $this->now->isoFormat('YYYY-MM-DD')) {
            return redirect()->back()->withErrors(['date' => 'Date Value is Unexpected!']);
        }

        // jika tahun, tidak dalam peride
        $year = $this->now->isoFormat('YYYY');
        $tempDateInput = Carbon::create($cashMutation['date']);
        $yearInput = $tempDateInput->isoFormat('YYYY');

        if ($yearInput !== $year) {
            return redirect()->back()->withErrors(['date' => 'Date Value is Unexpected!']);
        }

        // cek apakah role user yang mengakses adalah admin atau pengguna yang membuat data, jika bukan, maka redirect ke halaman awal
        $organizationUser = User::whereId($user['id'])
            ->with('organizations', function ($query) use ($organization) {
                $query->whereOrganizationId($organization['id']);
            })
            ->first();

        if ($user['id'] !== $cashMutation['user_id'] && $organizationUser->organizations[0]->pivot->role !== 'admin') {
            return redirect(route('cashflow.cash-mutation', $organization['id']))->with('error', 'Anda Tidak Memiliki Hak Akses');
        }

        $journal = Journal::find($cashMutation['journal_id']);
        $journal->delete();

        $log = [
            'description' => $cashMutation['description'],
            'date' => $cashMutation['date'],
            'no_ref' => $cashMutation['no_ref'],
            'value' => $cashMutation['value'],
        ];

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menghapus DATA pada MUTASI KAS, yaitu DATA : '.json_encode($log));

        return redirect(route('cashflow.cash-mutation', $organization['id']));
    }
}
