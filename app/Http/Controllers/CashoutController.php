<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Ledger;
use App\Helpers\NewRef;
use App\Models\Account;
use App\Models\Cashout;
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

class CashoutController extends Controller
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
        $refHeader = 'KK-'.$dateRef->isoFormat('YYYY').$dateRef->isoFormat('MM');
        $newRef = $refHeader.'001';

        $cashOut = Cashout::whereOrganizationId($organization['id'])
            ->where('no_ref', 'like', $refHeader.'%')
            ->orderBy('no_ref','desc')
            ->first();

        if ($cashOut) {
            $newRef = NewRef::create('KK-', $cashOut['no_ref']);
        }


        return $newRef;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Organization $organization)
    {
        $user = Auth::user();

        $cashOuts = Cashout::filter(request(['search', 'start_date', 'end_date', 'is_approved', 'program', 'project', 'department']))
            ->whereOrganizationId($organization['id'])
            ->with('journal')
            ->with('contact')
            ->orderBy('date', 'desc')
            ->orderBy('no_ref', 'desc')
            ->paginate(50)->withQueryString();

        return Inertia::render('CashOut/Index', [
            'startDate' => request('start_date'),
            'endDate' => request('end_date'),
            'organization' => $organization,
            'cashOuts' => $cashOuts,
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

        return Inertia::render('CashOut/Create', [
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
        // dd($request);
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
                Rule::unique('cashouts')->where(function ($query) use ($organization) {
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
            $validated['accounts'][$index]['credit'] = 0;
            $validated['accounts'][$index]['debit'] = $account['value'];
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
            'credit' => $value,
            'debit' => 0,
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

        Cashout::create($validated);

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menambahkan DATA pada KAS KELUAR dengan DATA : '.json_encode($log));

        return redirect(route('cashflow.cash-out.create', $organization['id']));

    }

    /**
     * Display the specified resource.
     */
    public function show(Organization $organization, Cashout $cashOut)
    {
        $user = Auth::user();

        $journal = Journal::find($cashOut['journal_id']);

        $journalUser = $journal->user()->get();

        return Inertia::render('CashOut/Show', [
            'organization' => $organization,
            'role' => $this->userRepository->getRole($user['id'], $organization['id']),
            'cashOut' => $cashOut,
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
    public function edit(Organization $organization, Cashout $cashOut)
    {
        $user = Auth::user();

        $cashOut->journal->ledgers;

        $accounts = [];
        $selectedAccount = [];
        $index = 0;
        $cashAccount = null;
        $value = 0;
        foreach ($cashOut->journal->ledgers as $ledger) {
            if ($ledger['debit'] > 0) {
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
                    'value' => $ledger['debit'],

                ];
                $index++;
            } else {
                $cashAccount = Account::find($ledger['account_id']);
                $value = $ledger['debit'];
            }
        }

        $cashOut->journal->program;
        $cashOut->journal->project;
        $cashOut->journal->department;
        $cashOut->contact;

        $cashOut['selectedAccount'] = $selectedAccount;
        $cashOut['accounts'] = $accounts;
        $cashOut['cashAccount'] = $cashAccount;

        return Inertia::render('CashOut/Edit', [
            'cashOut' => $cashOut,
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
    public function update(Request $request, Organization $organization, Cashout $cashOut)
    {
        $user = Auth::user();

        // cek apakah role user yang mengakses adalah admin atau pengguna yang membuat data, jika bukan, maka redirect ke halaman awal
        $organizationUser = User::whereId($user['id'])
            ->with('organizations', function ($query) use ($organization) {
                $query->whereOrganizationId($organization['id']);
            })
            ->first();

        if ($user['id'] !== $cashOut['created_by_id'] && $organizationUser->organizations[0]->pivot->role !== 'admin') {
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
                Rule::unique('cashouts')->where(function ($query) use ($organization) {
                    return $query->where('organization_id', $organization['id']);
                })->ignore($cashOut['id']),
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
            $validated['accounts'][$index]['credit'] = 0;
            $validated['accounts'][$index]['debit'] = $account['value'];
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
            'credit' => $value,
            'debit' => 0,
        ];

        $cashOut->update($validated);

        $this->journalRepository->update($validated, $cashOut->journal);

        $log = [
            'description' => $validated['description'],
            'date' => $validated['date'],
            'no_ref' => $validated['no_ref'],
            'value' => $value,
        ];

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah mengubah DATA pada KAS KELUAR menjadi : '.json_encode($log));

        return redirect(route('cashflow.cash-out.edit', ['organization' => $organization['id'], 'cashOut' => $cashOut]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Organization $organization, Cashout $cashOut)
    {
        $user = Auth::user();

        // cek tanggal
        // jika tanggal lebih tinggi dari hari sekarang, maka kirimkan error\
        if ($cashOut['date'] > $this->now->isoFormat('YYYY-MM-DD')) {
            return redirect()->back()->withErrors(['date' => 'Date Value is Unexpected!']);
        }

        // jika tahun, tidak dalam peride
        $year = $this->now->isoFormat('YYYY');
        $tempDateInput = Carbon::create($cashOut['date']);
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

        if ($user['id'] !== $cashOut['user_id'] && $organizationUser->organizations[0]->pivot->role !== 'admin') {
            return redirect(route('cashflow.cash-in', $organization['id']))->with('error', 'Anda Tidak Memiliki Hak Akses');
        }

        $journal = Journal::find($cashOut['journal_id']);
        $journal->delete();

        $log = [
            'description' => $cashOut['description'],
            'date' => $cashOut['date'],
            'no_ref' => $cashOut['no_ref'],
            'value' => $cashOut['value'],
        ];

        $this->logRepository->store($organization['id'], strtoupper($user['name']).' telah menghapus DATA pada KAS KELUAR, yaitu DATA : '.json_encode($log));

        return redirect(route('cashflow.cash-out', $organization['id']));
    }
}
