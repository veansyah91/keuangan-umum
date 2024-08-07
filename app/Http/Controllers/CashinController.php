<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Cashin;
use App\Models\Ledger;
use App\Helpers\NewRef;
use App\Models\Account;
use App\Models\Contact;
use App\Models\Journal;
use App\Models\Program;
use App\Models\Project;
use App\Models\Department;
use Carbon\CarbonImmutable;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use App\Repositories\Log\LogRepository;
use App\Repositories\User\UserRepository;
use App\Repositories\Account\AccountRepository;
use App\Repositories\Contact\ContactRepository;
use App\Repositories\Journal\JournalRepository;
use App\Repositories\Program\ProgramRepository;
use App\Repositories\Project\ProjectRepository;
use App\Repositories\Department\DepartmentRepository;

class CashinController extends Controller
{
    protected $userRepository;
    protected $logRepository;
    protected $journalRepository;
    protected $contactRepository;
    protected $accountRepository;
    protected $programRepository;
    protected $projectRepository;
    protected $departmentRepository;
    protected $now;

    public function __construct(UserRepository $userRepository, LogRepository $logRepository, JournalRepository $journalRepository, ContactRepository $contactRepository, AccountRepository $accountRepository, ProgramRepository $programRepository, ProjectRepository $projectRepository, DepartmentRepository $departmentRepository)
    {
        $this->userRepository = $userRepository;
        $this->logRepository = $logRepository;
        $this->journalRepository = $journalRepository;
        $this->contactRepository = $contactRepository;
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
        $refHeader = 'KM-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
        $newRef = $refHeader.'001';

        $cashIn = CashIn::whereOrganizationId($organization['id'])
            ->where('no_ref', 'like', $refHeader.'%')
            ->orderBy('no_ref')
            ->latest()
            ->first();

        if ($cashIn) {
            $newRef = NewRef::create('KM-', $cashIn['no_ref']);
        }

        return $newRef;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Organization $organization)
    {
        $user = Auth::user();

        $cashIns = Cashin::filter(request(['search', 'start_date', 'end_date', 'is_approved', 'program', 'project', 'department']))
            ->whereOrganizationId($organization['id'])
            ->with('journal')
            ->with('contact')
            ->orderBy('date', 'desc')
            ->orderBy('no_ref', 'desc')
            ->paginate(50);

        return Inertia::render('CashIn/Index', [
            'startDate' => request('start_date'),
            'endDate' => request('end_date'),
            'organization' => $organization,
            'cashIns' => $cashIns,
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

        return Inertia::render('CashIn/Create', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'newRef' => $this->newRef($organization, request('date')),
            'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
            'accounts' => $this->accountRepository->getDataNonCash($organization['id'], request(['account'])),
            'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),
            'contacts' => $this->contactRepository->getData($organization['id'], request(['contact'])),
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
                Rule::unique('cashins')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                }),
            ],
            'contact_id' => [
                'required',
                'exists:contacts,id',
            ],
            'cash_account_id' => [
                'required',
                'exists:accounts,id',
            ],
            'accounts' => [
                'required',
            ],
            'accounts.*.id' => [
                'required',
                'exists:accounts,id',
            ],
            'accounts.*.value' => [
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

        $value = 0;

        $index = 0;

        foreach ($validated['accounts'] as $account) {
            $validated['accounts'][$index]['debit'] = 0;
            $validated['accounts'][$index]['credit'] = $account['value'];
            $index++;
            $value += $account['value'];
        }

        $validated['value'] = $value;
        $validated['organization_id'] = $organization['id'];
        $validated['user_id'] = $user['id'];

        $validated['accounts'][$index] = [
            'id' => $validated['cash_account_id'],
            'name' => '',
            'code' => '',
            'is_cash' => 1,
            'debit' => $value,
            'credit' => 0,
        ];

        $journal = $this->journalRepository->store($validated);
        $validated['journal_id'] = $journal['id'];

        $log = [
            'description' => $validated['description'],
            'date' => $validated['date'],
            'no_ref' => $validated['no_ref'],
            'value' => $value,
        ];

        $validated['created_by_id'] = $user['id'];

        Cashin::create($validated);

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada KAS MASUK dengan DATA : '.json_encode($log));

        return redirect(route('cashflow.cash-in.create', $organization['id']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization, Cashin $cashIn)
    {
        $user = Auth::user();

        $journal = Journal::find($cashIn['journal_id']);
        $journalUser = $journal->user()->get();

        return Inertia::render('CashIn/Show', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'cashIn' => $cashIn,
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
    public function edit(Organization $organization, Cashin $cashIn)
    {
        $user = Auth::user();

        $cashIn->journal->ledgers;

        $accounts = [];
        $selectedAccount = [];
        $index = 0;
        $cashAccount = null;
        $value = 0;
        foreach ($cashIn->journal->ledgers as $ledger) {
            if ($ledger['credit'] > 0) {
                $account = Account::find($ledger['account_id']);
                $selectedAccount[$index] = [
                    'id' => $account['id'],
                    'name' => $account['name'],
                    'code' => $account['code'],
                ];
                $accounts[$index] = [
                    'id' => $account['id'],
                    'name' => $account['name'],
                    'code' => $account['code'],
                    'is_cash' => $account['is_cash'],
                    'value' => $ledger['credit'],

                ];
                $index++;
            } else {
                $cashAccount = Account::find($ledger['account_id']);
                $value = $ledger['credit'];
            }
        }

        $cashIn->journal->program;
        $cashIn->journal->project;
        $cashIn->journal->department;
        $cashIn->contact;

        $cashIn['selectedAccount'] = $selectedAccount;
        $cashIn['accounts'] = $accounts;
        $cashIn['cashAccount'] = $cashAccount;

        return Inertia::render('CashIn/Edit', [
            'cashIn' => $cashIn,
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'newRef' => $this->newRef($organization, request('date')),
            'date' => request('date') ?? $this->now->isoFormat('YYYY-MM-DD'),
            'accounts' => $this->accountRepository->getDataNonCash($organization['id'], request(['account'])),
            'cashAccounts' => $this->accountRepository->getDataCash($organization['id'], request(['account'])),
            'contacts' => $this->contactRepository->getData($organization['id'], request(['contact'])),
            'programs' => $this->programRepository->getData($organization['id']),
            'projects' => $this->projectRepository->getData($organization['id']),
            'departments' => $this->departmentRepository->getData($organization['id']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Organization $organization, Cashin $cashIn)
    {
        $user = Auth::user();

        // cek apakah role user yang mengakses adalah admin atau pengguna yang membuat data, jika bukan, maka redirect ke halaman awal
        $organizationUser = User::whereId($user['id'])
            ->with('organizations', function ($query) use ($organization) {
                $query->whereOrganizationId($organization['id']);
            })
            ->first();

        if ($user['id'] !== $cashIn['created_by_id'] && $organizationUser->organizations[0]->pivot->role !== 'admin') {
            return redirect(route('cashflow.journal', $organization['id']))->with('error', 'Anda Tidak Memiliki Hak Akses');
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
                Rule::unique('cashins')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                })->ignore($cashIn['id']),
            ],
            'contact_id' => [
                'required',
                'exists:contacts,id',
            ],
            'cash_account_id' => [
                'required',
                'exists:accounts,id',
            ],
            'accounts' => [
                'required',
            ],
            'accounts.*.id' => [
                'required',
                'exists:accounts,id',
            ],
            'accounts.*.value' => [
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

        $value = 0;

        $index = 0;

        foreach ($validated['accounts'] as $account) {
            $validated['accounts'][$index]['debit'] = 0;
            $validated['accounts'][$index]['credit'] = $account['value'];
            $index++;
            $value += $account['value'];
        }

        $validated['value'] = $value;
        $validated['organization_id'] = $organization['id'];
        $validated['user_id'] = $user['id'];

        $validated['accounts'][$index] = [
            'id' => $validated['cash_account_id'],
            'name' => '',
            'code' => '',
            'is_cash' => 1,
            'debit' => $value,
            'credit' => 0,
        ];

        $cashIn->update($validated);

        $this->journalRepository->update($validated, $cashIn->journal);

        $log = [
            'description' => $validated['description'],
            'date' => $validated['date'],
            'no_ref' => $validated['no_ref'],
            'value' => $value,
        ];

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah mengubah DATA pada KAS MASUK menjadi : '.json_encode($log));

        return redirect(route('cashflow.cash-in.edit', ['organization' => $organization['id'], 'cashIn' => $cashIn]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, Cashin $cashIn)
    {
        $user = Auth::user();

        // cek tanggal
        // jika tanggal lebih tinggi dari hari sekarang, maka kirimkan error\
        if ($cashIn['date'] > $this->now->isoFormat('YYYY-MM-DD')) {
            return redirect()->back()->withErrors(['date' => 'Date Value is Unexpected!']);
        }

        // jika tahun, tidak dalam peride
        $year = $this->now->isoFormat('YYYY');
        $tempDateInput = Carbon::create($cashIn['date']);
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

        if ($user['id'] !== $cashIn['user_id'] && $organizationUser->organizations[0]->pivot->role !== 'admin') {
            return redirect(route('cashflow.cash-in', $organization['id']))->with('error', 'Anda Tidak Memiliki Hak Akses');
        }

        $journal = Journal::find($cashIn['journal_id']);
        $journal->delete();

        $log = [
            'description' => $cashIn['description'],
            'date' => $cashIn['date'],
            'no_ref' => $cashIn['no_ref'],
            'value' => $cashIn['value'],
        ];

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menghapus DATA pada KAS MASUK, yaitu DATA : '.json_encode($log));

        return redirect(route('cashflow.cash-in', $organization['id']));

    }
}
